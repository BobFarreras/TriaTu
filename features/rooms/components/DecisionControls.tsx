'use client'

import { useState, useTransition } from 'react';
// ✅ 1. IMPORT CORRECTE: Importem només l'acció unificada des de decision-actions
import { makeGroupDecisionAction } from '@/app/actions/room-actions';
import { addCandidateAction, toggleVotingModeAction, removeCandidateAction } from '@/app/actions/candidate-actions';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

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

  // Props de simulació
  simulatedInputValue?: string;
  isSimulatingLoading?: boolean;
  onSimulatedAdd?: () => void;
}

export function DecisionControls({
  roomId, userId, isHost, mode, candidates, votingMode,
  simulatedInputValue = '', isSimulatingLoading = false, onSimulatedAdd
}: Props) {
  const { t, locale } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddCandidate = async () => {
    if (onSimulatedAdd && simulatedInputValue) {
      onSimulatedAdd();
      return;
    }

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

  // ✅ 2. FUNCIÓ SIMPLIFICADA
  const handleDecide = () => {
    setError(null);
    startTransition(async () => {
      
      // Ara cridem SEMPRE a la mateixa funció, passant el mode i l'idioma
      const res = await makeGroupDecisionAction(roomId, mode, locale);

      if (!res.success) setError(res.error || t.room.err_general);
    });
  };

  const handleDeleteCandidate = (candidateId: string) => {
    console.log("🖱️ [UI] Delete Button Clicked for:", candidateId);

    startTransition(async () => {
      const res = await removeCandidateAction(candidateId, roomId);
      if (!res.success) {
        console.error("❌ [UI] Error deleting:", res.error);
        alert("Error: " + res.error);
      } else {
        console.log("✅ [UI] Delete action completed.");
      }
    });
  };

  const displayInputValue = simulatedInputValue || inputValue;
  const showLoading = isPending || isSimulatingLoading;
  return (
    <div className="space-y-6 h-full flex flex-col">
      {mode === 'manual' ? (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6 flex-1">

          {/* SWITCH DE VISIBILITAT */}
          <div id="tour-room-mode-switch" className="bg-black/30 p-4 rounded-3xl border-2 border-zinc-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${votingMode === 'BLIND' ? 'bg-purple-900/50 text-purple-400' : 'bg-blue-900/50 text-blue-400'}`}>
                {votingMode === 'BLIND' ? <EyeOff size={24} /> : <Eye size={24} />}
              </div>
              <div>
                <p className="font-bold text-white">
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
                disabled={showLoading}
                className="px-4 py-2 bg-zinc-800 border-2 border-zinc-600 rounded-xl font-bold text-xs hover:bg-zinc-700 text-white transition-colors"
              >
                {t.room.btn_change}
              </button>
            )}
          </div>

          {/* LLISTA DE CANDIDATS */}
          <div id="tour-room-candidates" className="min-h-50 content-start flex flex-wrap gap-3">
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
                      ? 'bg-blue-600 border-blue-800 text-white shadow-lg'
                      : isHidden
                        ? 'bg-zinc-800 border-zinc-950 text-gray-500 pattern-diagonal-lines'
                        : 'bg-zinc-800 border-zinc-950 text-gray-200'
                    }
                  `}
                >
                  {isHidden ? t.room.hidden_candidate : c.content}

                  {(isMine || isHost) && !c.id.startsWith('fake-') && (
                    <button
                      onClick={() => handleDeleteCandidate(c.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-black/20 hover:bg-red-500 hover:text-white transition-colors text-gray-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              );
            })}

            {candidates.length === 0 && (
              <div className="w-full h-32 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-zinc-700 rounded-3xl">
                <span className="text-4xl mb-2 grayscale opacity-50">🤷‍♂️</span>
                <p className="font-bold">{t.room.empty_options}</p>
              </div>
            )}
          </div>

          {/* INPUT BARRA INFERIOR */}
          <div id="tour-room-input" className="flex gap-2 relative">
            <input
              value={displayInputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.room.input_placeholder}
              readOnly={!!simulatedInputValue}
              className="w-full pl-6 pr-4 py-4 bg-zinc-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-lg text-white placeholder:text-zinc-600 transition-all"
            />
            <button
              onClick={handleAddCandidate}
              disabled={!displayInputValue.trim()}
              className="aspect-square h-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center justify-center border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:border-b-0 disabled:translate-y-0 transition-all"
            >
              <Plus size={28} strokeWidth={3} />
            </button>
          </div>
        </div>
      ) : (
        /* MODE MÀGIC */
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-left-4 duration-300 p-8 border-4 border-dashed border-purple-900/30 rounded-[3rem] bg-purple-900/10">
          <div className="text-8xl mb-6 animate-pulse grayscale brightness-150">🔮</div>
          <h3 className="text-2xl font-black text-purple-300 mb-2">{t.room.magic_title}</h3>
          <p className="text-gray-400 font-medium max-w-sm">{t.room.magic_desc}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 text-red-400 p-3 rounded-xl text-center font-bold animate-shake border border-red-900/50">
          🚫 {error}
        </div>
      )}

      {/* BIG FAT ACTION BUTTON */}
      <div id="tour-room-action" className="pt-4 border-t border-zinc-800">
        {isHost ? (
          <Button
            onClick={handleDecide}
            isLoading={showLoading}
            // En mode màgic no necessitem candidats a la llista, els busca a la BD
            disabled={mode === 'manual' && candidates.length === 0}
            className={`w-full text-xl py-6 rounded-2xl shadow-xl transition-transform hover:scale-[1.02] active:scale-[0.98] ${mode === 'magic'
              ? 'bg-purple-600 border-purple-800 hover:bg-purple-500 text-white'
              : 'bg-green-600 border-green-800 hover:bg-green-500 text-white'
              }`}
          >
            {mode === 'magic' ? t.room.decide_magic : t.room.decide_roll}
          </Button>
        ) : (
          <div className="p-4 bg-zinc-800 rounded-2xl text-center border border-zinc-700">
            <span className="animate-pulse text-2xl inline-block mb-1">⏳</span>
            <p className="font-bold text-gray-400">{t.room.waiting_host}</p>
          </div>
        )}
      </div>
    </div>
  );
}
