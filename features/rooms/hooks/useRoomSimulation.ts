// src/hooks/useRoomSimulation.ts
import { useState, useEffect } from 'react';
import { CandidateDTO } from '@/features/rooms/components/DecisionControls';

import { RoomDTO } from '@/features/rooms/components/RoomDetail';
import { HistoryItem } from '../logic/history-types';

/**
 * Hook personalitzat que gestiona tota la lògica "fake" del tour d'onboarding.
 * Separa la lògica de presentació de la lògica de simulació.
 */
export function useRoomSimulation(
  room: RoomDTO,
  currentUserId: string,
  initialCandidates: CandidateDTO[],
  isTourActive: boolean,
  currentStepIndex: number,
  nextStep: () => void,
  steps: { targetId: string }[]
) {
  const [simInput, setSimInput] = useState('');
  const [fakeCandidates, setFakeCandidates] = useState<CandidateDTO[]>([]);
  const [isSimLoading, setIsSimLoading] = useState(false);
  const [fakeHistory, setFakeHistory] = useState<HistoryItem[]>([]);
  const inputStepIndex = steps.findIndex((step) => step.targetId === 'tour-room-input');
  const candidatesStepIndex = steps.findIndex((step) => step.targetId === 'tour-room-candidates');
  const actionStepIndex = steps.findIndex((step) => step.targetId === 'tour-room-action');

  // Lògica de l'autòmat de simulació
  useEffect(() => {
    if (!isTourActive) return;

    // Pas 2: Escriure text
    if (currentStepIndex === inputStepIndex) {
      const text = "Pizza 🍕";
      let i = 0;
      const interval = setInterval(() => {
        setSimInput(text.slice(0, i + 1));
        i++;
        if (i > text.length) clearInterval(interval);
      }, 100);
      return () => clearInterval(interval);
    }

    // Pas 3: Afegir candidat automàticament
    if (currentStepIndex === candidatesStepIndex && fakeCandidates.length === 0) {
      const timer = setTimeout(() => {
        setSimInput('');
        setFakeCandidates([{ id: 'fake-1', userId: currentUserId, content: "Pizza 🍕" }]);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [candidatesStepIndex, currentStepIndex, currentUserId, fakeCandidates.length, inputStepIndex, isTourActive]);

  // Handlers per interaccions simulades
  const handleSimulatedAdd = () => {
    if (isTourActive && currentStepIndex === inputStepIndex) nextStep();
  };

  const handleSimulatedDecide = () => {
    if (isTourActive && currentStepIndex === actionStepIndex) {
      setIsSimLoading(true);
      setTimeout(() => {
        setIsSimLoading(false);
        setFakeHistory([{
          choice: "Pizza 🍕",
          reason: "La IA ha decidit que avui toca un clàssic! 🧀",
          date: new Date().toISOString(),
          metadata: { matchPercentage: 98, avoidedAllergies: ['Gluten (simulat)'] }
        }, ...room.history]);
        nextStep();
      }, 1500);
    }
  };

  // Retornem les dades processades (Reals o Fake segons l'estat)
  return {
    displayCandidates: isTourActive && fakeCandidates.length > 0 ? fakeCandidates : initialCandidates,
    displayHistory: isTourActive && fakeHistory.length > 0 ? fakeHistory : room.history,
    simInput,
    isSimLoading,
    actionStepIndex,
    handlers: {
      onSimulatedAdd: handleSimulatedAdd,
      onSimulatedDecide: handleSimulatedDecide
    }
  };
}
