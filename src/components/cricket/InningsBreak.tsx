import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import type { MatchState } from '@/types/cricket';

interface Props {
  state: MatchState;
  onStart: () => void;
}

export default function InningsBreak({ state, onStart }: Props) {
  const inn = state.innings[0]!;
  const team = state.teams[inn.battingTeamIndex];
  const oversStr = `${Math.floor(inn.totalBalls / 6)}.${inn.totalBalls % 6}`;
  const battingSecond = state.teams[1 - inn.battingTeamIndex];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 max-w-lg mx-auto">
      <div className="text-5xl mb-4">🏏</div>
      <h2 className="text-xl font-black text-foreground mb-1">Innings Break</h2>
      <div className="bg-card rounded-xl p-6 w-full mt-4 text-center">
        <p className="text-primary font-bold text-lg">{team.name}</p>
        <p className="text-4xl font-black text-foreground mt-2 score-highlight">
          {inn.score}/{inn.wickets}
        </p>
        <p className="text-muted-foreground mt-1">({oversStr} overs)</p>
      </div>

      <div className="bg-card rounded-xl p-6 w-full mt-4 text-center">
        <p className="text-foreground font-bold">{battingSecond.name} needs</p>
        <p className="text-3xl font-black text-primary mt-2">{state.target} runs</p>
        <p className="text-muted-foreground">in {state.oversPerInnings} overs</p>
      </div>

      <Button
        onClick={onStart}
        className="mt-8 w-full h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Start 2nd Innings <ChevronRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}
