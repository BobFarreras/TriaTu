'use client'

import { useState, useTransition } from 'react';
import { makeIndividualDecisionAction } from '@/app/actions/decision-actions';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { DecisionType } from '@/core/domain/entities/Decision';

export function IndividualDecisionForm({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ choice: string, reason: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Estat local del formulari
  const [energy, setEnergy] = useState(5);
  const [time, setTime] = useState(30);

  const handleSubmit = async () => {
    setError(null);
    setResult(null);

    startTransition(async () => {
      const response = await makeIndividualDecisionAction({
        userId,
        type: DecisionType.FOOD, // Hardcoded per MVP
        energyLevel: Number(energy),
        timeMinutes: Number(time)
      });

      if (response.success && response.data) {
        setResult({
          choice: response.data.choice!,
          reason: response.data.reason!
        });
      } else {
        setError(response.error || 'Something went wrong');
      }
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      
      {!result ? (
        <Card className="space-y-6">
          <h2 className="text-xl font-bold">What should I eat? 🍽️</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Energy Level (0-10): {energy}</label>
              <input 
                type="range" min="0" max="10" 
                value={energy} 
                onChange={(e) => setEnergy(Number(e.target.value))}
                className="w-full mt-2"
              />
              <p className="text-xs text-gray-500">
                {energy < 4 ? 'Low energy (I want something easy)' : 'High energy (I can cook/travel)'}
              </p>
            </div>

            <Input 
              label="Available Time (minutes)" 
              type="number" 
              value={time}
              onChange={(e) => setTime(Number(e.target.value))}
            />
          </div>

          <Button 
            className="w-full" 
            onClick={handleSubmit} 
            isLoading={isPending}
          >
            Decide for me
          </Button>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </Card>
      ) : (
        <Card className="text-center space-y-4 border-black dark:border-white animate-in fade-in zoom-in duration-300">
          <div className="text-4xl">🎉</div>
          <h3 className="text-2xl font-bold">{result.choice}</h3>
          <p className="text-gray-600 dark:text-gray-300 italic">"{result.reason}"</p>
          
          <Button variant="secondary" onClick={() => setResult(null)}>
            Start Over
          </Button>
        </Card>
      )}
    </div>
  );
}