import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight } from 'lucide-react';
import type { TeamInfo } from '@/types/cricket';

interface Props {
  mode: 'openers' | 'bowler';
  team: TeamInfo;
  teamLabel: string;
  disabledIndices?: number[];
  onSelect: (indices: number[]) => void;
}

export default function PlayerSelection({ mode, team, teamLabel, disabledIndices = [], onSelect }: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  const required = mode === 'openers' ? 2 : 1;
  const title = mode === 'openers' ? 'Select Opening Batsmen' : 'Select Bowler';
  const icon = mode === 'openers' ? '🏏' : '⚾';

  const toggle = (idx: number) => {
    if (disabledIndices.includes(idx)) return;
    setSelected(prev => {
      if (prev.includes(idx)) return prev.filter(i => i !== idx);
      if (prev.length >= required) return mode === 'openers' ? [...prev.slice(1), idx] : [idx];
      return [...prev, idx];
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 max-w-lg mx-auto">
      <div className="text-center pt-8 mb-6">
        <div className="text-4xl mb-3">{icon}</div>
        <h2 className="text-xl font-black text-foreground">{title}</h2>
        <p className="text-primary font-semibold mt-1">{teamLabel}</p>
        <p className="text-muted-foreground text-sm mt-1">Select {required} player{required > 1 ? 's' : ''}</p>
      </div>

      <div className="flex-1 space-y-2">
        {team.players.map((name, i) => {
          const isSelected = selected.includes(i);
          const isDisabled = disabledIndices.includes(i);
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              disabled={isDisabled}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                isSelected
                  ? 'bg-primary/20 border-2 border-primary'
                  : isDisabled
                  ? 'bg-muted/50 opacity-40 cursor-not-allowed border-2 border-transparent'
                  : 'bg-card border-2 border-transparent hover:border-border'
              }`}
            >
              <span className="font-semibold text-foreground">{name}</span>
              {isSelected && <Check className="h-5 w-5 text-primary" />}
            </button>
          );
        })}
      </div>

      <div className="pt-4 pb-4">
        <Button
          onClick={() => onSelect(selected)}
          disabled={selected.length !== required}
          className="w-full h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
        >
          Continue <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
