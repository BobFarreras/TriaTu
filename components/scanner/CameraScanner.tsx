// src/components/CameraScanner.tsx
'use client';

import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { scanImageAction } from '@/app/actions/scan';
import { ScannedItem } from '@/core/domain/types/ScannedItem';

interface CameraScannerProps {
  onItemsFound: (items: ScannedItem[], imageSrc: string) => void;
  onCancel: () => void;
}

export function CameraScanner({ onItemsFound, onCancel }: CameraScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  
  // Estats per controlar el flux visual
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // Guardem la foto aquí
  const [flash, setFlash] = useState(false); // Per l'efecte de disparador
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const videoConstraints = {
    facingMode: facingMode,
    width: { ideal: 1920 },
    height: { ideal: 1080 }
  };

  const capture = useCallback(async () => {
    // 1. Capturar la imatge
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    // 2. Feedback visual immediat (Flash + Congelar imatge)
    setFlash(true);
    setTimeout(() => setFlash(false), 150); // Flash dura 150ms
    setCapturedImage(imageSrc); // Substituïm webcam per la foto fixa
    setIsProcessing(true); // Activem l'estat de càrrega

    try {
      // 3. Convertir a File per enviar al servidor
      const res = await fetch(imageSrc);
      const blob = await res.blob();
      const file = new File([blob], "scan.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append('image', file);

      // 4. Cridar a la IA (Server Action)
      const result = await scanImageAction(formData);

      if (result.success) {
        onItemsFound(result.items, imageSrc);
      } else {
        alert('Error: ' + result.error);
        // Si falla, tornem a la càmera en viu
        setCapturedImage(null);
      }
    } catch (err) {
      console.error(err);
      alert('Error de connexió');
      setCapturedImage(null);
    } finally {
      setIsProcessing(false);
    }
  }, [onItemsFound]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      
      {/* --- HEADER --- */}
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

      {/* --- AREA PRINCIPAL (VISOR) --- */}
      <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
         
         {/* 1. VISOR DE CÀMERA (Només si no tenim foto capturada) */}
         {!capturedImage && (
           <Webcam
             audio={false}
             ref={webcamRef}
             screenshotFormat="image/jpeg"
             screenshotQuality={1}
             forceScreenshotSourceSize={true}
             videoConstraints={videoConstraints}
             className="absolute inset-0 w-full h-full object-cover"
           />
         )}

         {/* 2. FOTO CONGELADA (Es mostra quan hem disparat) */}
         {capturedImage && (
           <img 
             src={capturedImage} 
             alt="Captured" 
             className="absolute inset-0 w-full h-full object-contain bg-black" 
           />
         )}
         
         {/* 3. GUIES D'ENQUADRAMENT (Només en mode càmera) */}
         {!isProcessing && !capturedImage && (
            <div className="absolute inset-0 pointer-events-none opacity-30 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-white/50 rounded-3xl border-dashed"></div>
            </div>
         )}

         {/* 4. ANIMACIÓ D'ESCANEIG (LÀSER) - Es mostra durant el processament */}
         {isProcessing && (
           <div className="absolute inset-0 z-10 pointer-events-none">
             {/* Fons lleugerament enfosquit per resaltar el làser */}
             <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
             
             {/* Línia làser que es mou (animació Tailwind personalitzada o CSS estàndard) */}
             <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
             
             {/* Text informatiu centrat */}
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="bg-black/60 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/10 flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-cyan-300 font-bold text-lg tracking-wide">ANALITZANT...</p>
                  <p className="text-white/70 text-xs">Identificant productes i caducitats</p>
                </div>
             </div>
           </div>
         )}

         {/* 5. EFECTE FLASH (Pantalla blanca ràpida) */}
         {flash && (
           <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-150"></div>
         )}
      </div>

      {/* --- FOOTER (BOTÓ DE DISPARAR) --- */}
      {/* L'ocultem mentre processa per netejar la pantalla */}
      {!isProcessing && (
        <div className="absolute bottom-0 w-full p-8 flex justify-center items-center pb-12 z-20 bg-linear-to-t from-black/80 to-transparent">
          <button
            onClick={capture}
            className="w-20 h-20 rounded-full border-4 border-white bg-white/20 flex items-center justify-center active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-white/30"
          >
             <div className="w-16 h-16 bg-white rounded-full shadow-inner"></div>
          </button>
        </div>
      )}

      {/* Definició inline de l'animació scan si no la tens a tailwind.config.js */}
      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}