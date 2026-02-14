import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { TeamInfo } from '@/types/cricket';

interface Props {
  teams: [TeamInfo, TeamInfo];
  onToss: (winner: number, electsBatting: boolean) => void;
}

export default function TossScreen({ teams, onToss }: Props) {
  const [winner, setWinner] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 max-w-lg mx-auto">
      {winner === null ? (
        <>
          <div className="text-6xl mb-6">🪙</div>
          <h2 className="text-2xl font-black text-foreground mb-2">Toss</h2>
          <p className="text-muted-foreground mb-8">Who won the toss?</p>
          <div className="w-full space-y-3">
            {teams.map((t, i) => (
              <Button
                key={i}
                onClick={() => setWinner(i)}
                className="w-full h-16 text-xl font-bold bg-card text-foreground border-2 border-border hover:border-primary hover:bg-card/80 transition-all"
                variant="outline"
              >
                {t.name}
              </Button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-xl font-bold text-primary mb-1">{teams[winner].name}</h2>
          <p className="text-muted-foreground mb-8">won the toss! Choose to...</p>
          <div className="w-full grid grid-cols-2 gap-4">
            <Button
              onClick={() => onToss(winner, true)}
              className="h-20 text-lg font-bold bg-accent text-accent-foreground hover:bg-accent/80 flex flex-col"
            >
              <span className="text-2xl mb-1">🏏</span>
              Bat
            </Button>
            <Button
              onClick={() => onToss(winner, false)}
              className="h-20 text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 flex flex-col"
            >
              <span className="text-2xl mb-1">⚾</span>
              Bowl
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
