'use client';

import { useState, useEffect } from 'react';

export function CountdownTimer({ minutes }: { minutes: number }) {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
             clearInterval(interval);
             setIsActive(false);
             setIsFinished(true);
             return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]); // ✅ Dependència neta

  const toggleTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFinished) {
        setTimeLeft(minutes * 60);
        setIsFinished(false);
        setIsActive(true);
    } else {
        setIsActive(!isActive);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <button
      onClick={toggleTimer}
      className={`
        inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono transition-all ml-2 align-middle
        ${isFinished 
            ? 'bg-red-600 text-white animate-pulse' 
            : isActive 
                ? 'bg-purple-600 text-white border border-purple-400' 
                : 'bg-slate-800 text-purple-300 border border-slate-700 hover:bg-slate-700'
        }
      `}
    >
      <span>{isActive ? '⏳' : isFinished ? '🔔' : '⏱️'}</span>
      <span>{isFinished ? 'FI' : formatTime(timeLeft)}</span>
    </button>
  );
}