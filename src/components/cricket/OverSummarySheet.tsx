import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight } from 'lucide-react';
import type { MatchState } from '@/types/cricket';

interface Props {
  state: MatchState;
  onSelectBowler: (playerIndex: number) => void;
}

export default function OverSummarySheet({ state, onSelectBowler }: Props) {
  const inn = state.innings[state.currentInnings]!;
  const bowlingTeam = state.teams[1 - inn.battingTeamIndex];
  const lastBowlerPlayerIdx = inn.bowlers[inn.currentBowlerIdx]?.playerIndex;
  const overBalls = state.lastCompletedOver;
  const overRuns = overBalls.reduce((s, b) => s + b.runs, 0);
  const overNum = inn.overs.length;

  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-black text-foreground mb-2">Over {overNum} Summary</h2>
      <p className="text-primary font-bold text-2xl mb-4">{overRuns} runs</p>

      <div className="flex gap-2 mb-8 flex-wrap justify-center">
        {overBalls.map((b, i) => (
          <span
            key={i}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold ${
              b.isWicket ? 'bg-destructive text-destructive-foreground'
              : b.runs >= 4 ? 'bg-boundary text-boundary-foreground'
              : b.isWide || b.isNoBall ? 'bg-extras-color text-extras-foreground'
              : b.runs === 0 ? 'bg-muted text-muted-foreground'
              : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {b.label}
          </span>
        ))}
      </div>

      <h3 className="text-lg font-bold text-foreground mb-3">Select Next Bowler</h3>
      <div className="w-full space-y-2 mb-6">
        {bowlingTeam.players.map((name, i) => {
          const isLastBowler = i === lastBowlerPlayerIdx;
          const isSelected = selected === i;
          return (
            <button
              key={i}
              onClick={() => !isLastBowler && setSelected(i)}
              disabled={isLastBowler}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                isSelected ? 'bg-primary/20 border-2 border-primary'
                : isLastBowler ? 'bg-muted/50 opacity-40 cursor-not-allowed border-2 border-transparent'
                : 'bg-card border-2 border-transparent hover:border-border'
              }`}
            >
              <span className="font-semibold text-foreground">{name}</span>
              {isLastBowler && <span className="text-xs text-muted-foreground">Just bowled</span>}
              {isSelected && <Check className="h-4 w-4 text-primary" />}
            </button>
          );
        })}
      </div>

      <Button
        onClick={() => selected !== null && onSelectBowler(selected)}
        disabled={selected === null}
        className="w-full h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
      >
        Continue <ChevronRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}
