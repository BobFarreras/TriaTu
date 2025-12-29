'use client';

import { useMemo } from 'react';

interface FunDatePickerProps {
  date: string;
  onChange: (date: string) => void;
}

const MONTHS = [
  'GEN', 'FEB', 'MAR', 'ABR', 'MAI', 'JUN', 
  'JUL', 'AGO', 'SET', 'OCT', 'NOV', 'DES'
];

export function FunDatePicker({ date, onChange }: FunDatePickerProps) {
  
  const { day, month, year } = useMemo(() => {
    const d = date ? new Date(date) : new Date();
    if (isNaN(d.getTime())) {
      const now = new Date();
      return { day: now.getDate(), month: now.getMonth(), year: now.getFullYear() };
    }
    return { day: d.getDate(), month: d.getMonth(), year: d.getFullYear() };
  }, [date]);

  const adjust = (field: 'day'|'month'|'year', amount: number) => {
    let newDay = day, newMonth = month, newYear = year;

    if (field === 'day') {
      newDay += amount;
      const maxDays = new Date(newYear, newMonth + 1, 0).getDate();
      if (newDay > maxDays) newDay = 1;
      if (newDay < 1) newDay = maxDays;
    } else if (field === 'month') {
      newMonth += amount;
      if (newMonth > 11) { newMonth = 0; newYear++; }
      if (newMonth < 0) { newMonth = 11; newYear--; }
    } else if (field === 'year') {
      newYear += amount;
    }

    const daysInNewMonth = new Date(newYear, newMonth + 1, 0).getDate();
    const finalDay = Math.min(newDay, daysInNewMonth);
    const newDateObj = new Date(newYear, newMonth, finalDay);
    onChange(newDateObj.toLocaleDateString('en-CA'));
  };

  return (
    <div className="flex justify-center items-center gap-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-inner max-w-full overflow-hidden">
      
      {/* DIA */}
      <WheelColumn 
        label="DIA" 
        display={day.toString().padStart(2, '0')}
        onUp={() => adjust('day', 1)} 
        onDown={() => adjust('day', -1)} 
      />

      <div className="text-slate-700 font-bold text-2xl pb-6">:</div>

      {/* MES */}
      <WheelColumn 
        label="MES" 
        display={MONTHS[month]}
        onUp={() => adjust('month', 1)} 
        onDown={() => adjust('month', -1)} 
        isWide
      />

      <div className="text-slate-700 font-bold text-2xl pb-6">:</div>

      {/* ANY */}
      <WheelColumn 
        label="ANY" 
        display={year.toString()}
        onUp={() => adjust('year', 1)} 
        onDown={() => adjust('year', -1)} 
        isWide
      />
    </div>
  );
}

function WheelColumn({ 
  label, display, onUp, onDown, isWide = false 
}: { 
  label: string, display: string, onUp: () => void, onDown: () => void, isWide?: boolean 
}) {
  return (
    <div className={`flex flex-col items-center gap-2 ${isWide ? 'w-24' : 'w-20'}`}>
      
      {/* Botó Amunt (Més gran) */}
      <button 
        type="button"
        onClick={onUp}
        className="w-full h-10 flex items-center justify-center bg-slate-900 hover:bg-purple-900/30 text-slate-500 hover:text-purple-300 rounded-xl border border-slate-800 transition-colors active:scale-95"
      >
        ▲
      </button>

      {/* Finestra Central (Més gran) */}
      <div className="
        w-full h-20 flex items-center justify-center 
        bg-linear-to-b from-slate-900 via-slate-800 to-slate-900
        border-y-2 border-purple-500/30 
        text-white font-black text-3xl tracking-wider
        shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]
        relative overflow-hidden group cursor-ns-resize rounded-lg
      ">
        <span className="z-10 group-hover:scale-110 transition-transform drop-shadow-md">{display}</span>
      </div>

      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>

      {/* Botó Avall (Més gran) */}
      <button 
        type="button"
        onClick={onDown}
        className="w-full h-10 flex items-center justify-center bg-slate-900 hover:bg-purple-900/30 text-slate-500 hover:text-purple-300 rounded-xl border border-slate-800 transition-colors active:scale-95"
      >
        ▼
      </button>
    </div>
  );
}