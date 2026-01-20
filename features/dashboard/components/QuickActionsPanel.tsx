'use client';
import { IndividualDecisionForm } from '@/features/decision/components/IndividualDecisionForm';

interface Props {
    userId: string;
}

export function QuickActionsPanel({ userId }: Props) {
    return (
        // h-full és clau perquè ocupi tota l'alçada que li donem (sigui la fixa de desktop o l'automàtica de mòbil)
        <div className="h-full w-full animate-in slide-in-from-left-4 duration-700">
             <IndividualDecisionForm userId={userId} />
        </div>
    );
}
