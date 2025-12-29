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
  const [isProcessing, setIsProcessing] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  // ✅ MILLORA: Demanem "Idealment" Full HD. 
  // Si el mòbil no pot, baixarà sol, però intentarà donar la màxima qualitat.
  const videoConstraints = {
    facingMode: facingMode,
    width: { ideal: 1920 },
    height: { ideal: 1080 }
  };

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    setIsProcessing(true);

    try {
      const res = await fetch(imageSrc);
      const blob = await res.blob();
      const file = new File([blob], "scan.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append('image', file);

      const result = await scanImageAction(formData);

      if (result.success) {
        onItemsFound(result.items, imageSrc);
      } else {
        alert('Error: ' + result.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error de connexió');
    } finally {
      setIsProcessing(false);
    }
  }, [onItemsFound]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      
      {/* HEADER - ✅ Fix CSS: gradient-to-b */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={onCancel} className="text-white bg-white/20 px-4 py-2 rounded-full backdrop-blur-md font-bold text-sm">
           ✕ Tancar
        </button>
        <button onClick={toggleCamera} className="text-white bg-white/20 p-2 rounded-full backdrop-blur-md">
           🔄 Girar
        </button>
      </div>

      {/* WEBCAM */}
      <div className="flex-1 relative flex items-center justify-center bg-slate-900 overflow-hidden">
         <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={1} // ✅ MILLORA: Màxima qualitat (sense compressió)
            forceScreenshotSourceSize={true} // Manté la resolució nativa de la càmera
            videoConstraints={videoConstraints}
            className="absolute inset-0 w-full h-full object-cover"
         />
         
         {/* GUIES D'ENQUADRAMENT */}
         {!isProcessing && (
            <div className="absolute inset-0 pointer-events-none opacity-30 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-white/50 rounded-3xl border-dashed"></div>
            </div>
         )}

         {/* OVERLAY DE CÀRREGA */}
         {isProcessing && (
           <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm z-20">
             <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-purple-300 font-bold animate-pulse text-lg">La IA està pensant...</p>
             <p className="text-white/60 text-xs mt-2">Identificant aliments i caducitats...</p>
           </div>
         )}
      </div>

      {/* FOOTER - ✅ Fix CSS: gradient-to-t */}
      <div className="absolute bottom-0 w-full p-8 flex justify-center items-center bg-linear-to-t from-black/90 to-transparent pb-12 z-10">
        <button
          onClick={capture}
          disabled={isProcessing}
          className="w-20 h-20 rounded-full border-4 border-white bg-white/20 flex items-center justify-center active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-white/30"
        >
           <div className="w-16 h-16 bg-white rounded-full shadow-inner"></div>
        </button>
      </div>
    </div>
  );
}