'use client'

import { useState, useTransition } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { makeGroupDecisionAction } from '@/app/actions/room-actions';

interface Props {
  roomId: string;
  userId: string;
  hasEnoughParticipants: boolean;
}

export function DecisionControls({ roomId, userId, hasEnoughParticipants }: Props) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  
  // Estat per als candidats
  const [mode, setMode] = useState<'magic' | 'candidates'>('magic');
  const [candidates, setCandidates] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addCandidate = () => {
    if (inputValue.trim()) {
      setCandidates([...candidates, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeCandidate = (index: number) => {
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  const handleDecide = () => {
    startTransition(async () => {
      // Si estem en mode 'magic', enviem array buit. Si no, enviem candidats.
      const payload = mode === 'candidates' ? candidates : [];
      await makeGroupDecisionAction(roomId, userId, payload);
      
      // Netegem estat després de decidir
      setCandidates([]);
      setInputValue('');
    });
  };

  return (
    <Card className="border-2 border-black dark:border-white shadow-lg">
      <h3 className="text-xl font-bold mb-4">⚡ {t.room.make_decision_title}</h3>

      {/* Tabs per triar mode */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('magic')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'magic' 
              ? 'bg-black text-white dark:bg-white dark:text-black' 
              : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400'
          }`}
        >
          ✨ {t.room.mode_magic}
        </button>
        <button
          onClick={() => setMode('candidates')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'candidates' 
              ? 'bg-black text-white dark:bg-white dark:text-black' 
              : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400'
          }`}
        >
          📝 {t.room.mode_candidates}
        </button>
      </div>

      {/* Lògica Mode Candidats */}
      {mode === 'candidates' && (
        <div className="space-y-3 mb-4 animate-in fade-in">
          <div className="flex gap-2">
            <Input 
              placeholder={t.room.candidate_placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCandidate()}
              className="flex-1"
            />
            <Button onClick={addCandidate} variant="secondary">{t.room.add_btn}</Button>
          </div>

          {/* Llista de tags */}
          {candidates.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {candidates.map((c, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                  {c}
                  <button onClick={() => removeCandidate(idx)} className="hover:text-red-500 font-bold">×</button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <Button 
        className="w-full py-3 text-lg"
        onClick={handleDecide}
        isLoading={isPending}
        disabled={!hasEnoughParticipants || (mode === 'candidates' && candidates.length < 2)}
      >
        🎲 {t.room.decide_btn}
      </Button>
      
      {!hasEnoughParticipants && (
        <p className="text-xs text-center text-gray-500 mt-2">
          Necessites almenys 2 participants (o 1 participant i 2 opcions).
        </p>
      )}
    </Card>
  );
}