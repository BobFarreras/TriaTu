'use client';

import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
// ⚠️ ASSEGURA'T QUE AQUEST IMPORT ÉS EL CORRECTE
import { scanImageAction } from '@/app/actions/scan'; 
import { ScannedItem } from '@/core/domain/types/ScannedItem';

interface CameraScannerProps {
  onItemsFound: (items: ScannedItem[], imageSrc: string) => void;
  onCancel: () => void;
}

// ✅ 1. FUNCIÓ PURA DE JAVASCRIPT (SENSE FETCH = SENSE ERROR DE SEGURETAT)
function base64ToBlob(base64: string, mimeType = 'image/jpeg') {
  try {
    const arr = base64.split(',');
    const data = arr[1];
    const byteString = atob(data);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeType });
  } catch (e) {
    console.error("Error convertint base64:", e);
    return null;
  }
}

export function CameraScanner({ onItemsFound, onCancel }: CameraScannerProps) {
  const webcamRef = useRef<Webcam>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  // ✅ 2. REDUÏM RESOLUCIÓ PER EVITAR "FAILED TO FETCH" AL SERVIDOR
  // 1920x1080 a vegades genera un fitxer > 4MB que bloqueja la Server Action.
  const videoConstraints = {
    facingMode: facingMode,
    width: { ideal: 1280 }, // Baixem a 720p (Suficient per llegir text)
    height: { ideal: 720 }
  };

  const capture = useCallback(async () => {
    // ✅ 3. QUALITAT AL 0.6 (60%) PER REDUIR PES
    const imageSrc = webcamRef.current?.getScreenshot({ width: 1280, height: 720 });
    
    if (!imageSrc) {
        alert("No s'ha pogut capturar la imatge");
        return;
    }

    // Feedback visual
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
    setCapturedImage(imageSrc);
    setIsProcessing(true);

    try {
      // ❌ NO FEM FETCH AQUÍ (Això és el que donava l'error de seguretat)
      // const res = await fetch(imageSrc); 

      // ✅ CONVERSIÓ DIRECTA
      const blob = base64ToBlob(imageSrc);
      if (!blob) throw new Error("Error en processar la imatge");

      // Si el fitxer encara és massa gran (>4MB), l'Action fallarà.
      // Amb 720p i 0.92 (defecte webp) o jpeg hauria d'anar bé.
      const file = new File([blob], "scan.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append('image', file);

      console.log("📤 Enviant imatge al servidor...", file.size / 1024, "KB");

      // Cridar a la Server Action
      const result = await scanImageAction(formData);

      if (result.success) {
        onItemsFound(result.items, imageSrc);
      } else {
        throw new Error(result.error || 'No s\'han detectat ingredients.');
      }

    } catch (error: unknown) {
      console.error("❌ ERROR AL CAPTURAR:", error);

      let errorMessage = 'Error desconegut';
      if (error instanceof Error) {
        // Si l'error és "Failed to fetch" AQUÍ, vol dir que la Server Action ha petat per mida
        if (error.message.includes("fetch")) {
            errorMessage = "La imatge és massa gran o hi ha problemes de xarxa.";
        } else {
            errorMessage = error.message;
        }
      }

      alert(`⚠️ ${errorMessage}`);
      setCapturedImage(null); // Tornem a la càmera
    } finally {
      setIsProcessing(false);
    }
  }, [onItemsFound]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">

      {/* HEADER */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-center z-20">
        <button onClick={onCancel} disabled={isProcessing} className="text-white bg-black/40 px-4 py-2 rounded-full backdrop-blur-md font-bold text-sm border border-white/10">
          ✕ Tancar
        </button>
        {!capturedImage && (
          <button onClick={toggleCamera} className="text-white bg-black/40 p-2 rounded-full backdrop-blur-md border border-white/10">
            🔄 Girar
          </button>
        )}
      </div>

      {/* VISOR */}
      <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
        {!capturedImage && (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.6} // ✅ QUALITAT AL 60%
            forceScreenshotSourceSize={true}
            videoConstraints={videoConstraints}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {capturedImage && (
          <img src={capturedImage} alt="Captured" className="absolute inset-0 w-full h-full object-contain bg-black" />
        )}

        {/* LOADING SPINNER */}
        {isProcessing && (
          <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center">
             <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-white font-bold text-lg animate-pulse">Analitzant...</p>
          </div>
        )}

        {flash && <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-150"></div>}
      </div>

      {/* BOTÓ DISPARAR */}
      {!isProcessing && !capturedImage && (
        <div className="absolute bottom-0 w-full p-8 flex justify-center items-center pb-12 z-20 bg-linear-to-t from-black/80 to-transparent">
          <button
            onClick={capture}
            className="w-20 h-20 rounded-full border-4 border-white bg-white/20 flex items-center justify-center active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-white/30"
          >
            <div className="w-16 h-16 bg-white rounded-full shadow-inner"></div>
          </button>
        </div>
      )}
    </div>
  );
}