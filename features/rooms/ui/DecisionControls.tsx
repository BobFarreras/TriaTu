'use client'

import { useState, useTransition } from 'react';
import { makeGroupDecisionAction } from '@/app/actions/room-actions';
import { addCandidateAction, toggleVotingModeAction, removeCandidateAction } from '@/app/actions/candidate-actions';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext'; // <---

export interface CandidateDTO {
  id: string;
  userId: string;
  content: string;
}

interface Props {
  roomId: string;
  userId: string;
  isHost: boolean;
  mode: 'magic' | 'manual';
  candidates: CandidateDTO[];
  votingMode: 'BLIND' | 'PUBLIC';
}

export function DecisionControls({ roomId, userId, isHost, mode, candidates, votingMode }: Props) {
  const { t } = useLanguage(); // <---
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddCandidate = async () => {
    if (!inputValue.trim()) return;
    const content = inputValue;
    setInputValue('');
    const res = await addCandidateAction(roomId, content);
    if (!res.success) setError(res.error || t.room.err_add);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCandidate();
    }
  };

  const handleToggleMode = () => {
    startTransition(async () => {
      const newMode = votingMode === 'BLIND' ? 'PUBLIC' : 'BLIND';
      await toggleVotingModeAction(roomId, newMode);
    });
  };

  const handleDecide = () => {
    setError(null);
    startTransition(async () => {
      const res = await makeGroupDecisionAction(roomId, mode);
      if (!res.success) setError(res.error || t.room.err_general);
    });
  };

  const handleDeleteCandidate = (candidateId: string) => {
    startTransition(async () => {
      await removeCandidateAction(candidateId, roomId);
    });
  };

  return (
    <div className="space-y-8 h-full flex flex-col">

      {mode === 'manual' ? (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6 flex-1">
          
          {/* SWITCH DE VISIBILITAT */}
          <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-3xl border-2 border-gray-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${votingMode === 'BLIND' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                  {votingMode === 'BLIND' ? <EyeOff size={24} /> : <Eye size={24} />}
                </div>
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-200">
                    {votingMode === 'BLIND' ? t.room.voting_blind : t.room.voting_public}
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    {votingMode === 'BLIND' ? t.room.blind_desc : t.room.public_desc}
                  </p>
                </div>
              </div>
              
              {isHost && (
                <button 
                  onClick={handleToggleMode}
                  disabled={isPending}
                  className="px-4 py-2 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-xl font-bold text-xs hover:bg-gray-100 transition-colors"
                >
                  {t.room.btn_change}
                </button>
              )}
          </div>

          {/* LLISTA DE CANDIDATS */}
          <div className="min-h-50 content-start flex flex-wrap gap-3">
            {candidates.map((c, idx) => {
              const isMine = c.userId === userId;
              const isHidden = votingMode === 'BLIND' && !isMine && !isHost;
              
              return (
                <div 
                  key={c.id} 
                  style={{ animationDelay: `${idx * 50}ms` }}
                  className={`
                    animate-in zoom-in duration-300 relative group
                    pl-4 pr-10 py-3 rounded-2xl font-bold text-sm border-b-4 select-none
                    ${isMine 
                        ? 'bg-blue-500 border-blue-700 text-white shadow-blue-200 dark:shadow-none' 
                        : isHidden 
                           ? 'bg-gray-200 border-gray-300 text-gray-400 dark:bg-zinc-800 dark:border-zinc-700 pattern-diagonal-lines'
                           : 'bg-white border-gray-200 text-gray-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-200'
                    }
                  `}
                >
                  {isHidden ? t.room.hidden_candidate : c.content}
                  
                  {(isMine || isHost) && (
                    <button 
                      onClick={() => handleDeleteCandidate(c.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-black/10 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              );
            })}
            
            {candidates.length === 0 && (
               <div className="w-full h-32 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 rounded-3xl">
                 <span className="text-4xl mb-2">🤷‍♂️</span>
                 <p className="font-bold">{t.room.empty_options}</p>
               </div>
            )}
          </div>

          {/* INPUT BARRA INFERIOR */}
          <div className="flex gap-2 relative">
              <input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.room.input_placeholder}
                className="w-full pl-6 pr-4 py-4 bg-gray-50 dark:bg-zinc-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-lg transition-all"
              />
              <button 
                onClick={handleAddCandidate}
                disabled={!inputValue.trim()}
                className="aspect-square h-full bg-blue-500 hover:bg-blue-400 text-white rounded-2xl flex items-center justify-center border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:border-b-0 disabled:translate-y-0 transition-all"
              >
                <Plus size={28} strokeWidth={3} />
              </button>
          </div>
        </div>
      ) : (
        /* MODE MÀGIC */
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-left-4 duration-300 p-8 border-4 border-dashed border-purple-100 dark:border-purple-900/30 rounded-[3rem] bg-purple-50/50 dark:bg-purple-900/10">
           <div className="text-8xl mb-6 animate-pulse">🔮</div>
           <h3 className="text-2xl font-black text-purple-900 dark:text-purple-300 mb-2">
             {t.room.magic_title}
           </h3>
           <p className="text-gray-500 font-medium max-w-sm">
             {t.room.magic_desc}
           </p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-xl text-center font-bold animate-shake">
          🚫 {error}
        </div>
      )}

      {/* BIG FAT ACTION BUTTON */}
      <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
        {isHost ? (
          <Button 
            onClick={handleDecide}
            isLoading={isPending}
            disabled={mode === 'manual' && candidates.length === 0}
            className={`w-full text-xl py-6 rounded-2xl shadow-xl transition-transform hover:scale-[1.02] active:scale-[0.98] ${
                mode === 'magic' 
                ? 'bg-purple-600 border-purple-800 hover:bg-purple-500' 
                : 'bg-green-500 border-green-700 hover:bg-green-400'
            }`}
          >
            {mode === 'magic' ? t.room.decide_magic : t.room.decide_roll}
          </Button>
        ) : (
          <div className="p-4 bg-gray-100 dark:bg-zinc-800 rounded-2xl text-center">
              <span className="animate-pulse text-2xl inline-block mb-1">⏳</span>
              <p className="font-bold text-gray-500">{t.room.waiting_host}</p>
          </div>
        )}
      </div>
    </div>
  );
}