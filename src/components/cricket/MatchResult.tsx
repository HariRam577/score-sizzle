import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import type { MatchState } from '@/types/cricket';

interface Props {
  state: MatchState;
  onReset: () => void;
}

export default function MatchResult({ state, onReset }: Props) {
  const inn1 = state.innings[0]!;
  const inn2 = state.innings[1]!;
  const team1 = state.teams[inn1.battingTeamIndex];
  const team2 = state.teams[inn2.battingTeamIndex];

  let resultText = '';
  if (state.winner === -1) {
    resultText = "It's a Tie! 🤝";
  } else if (state.winner !== null) {
    const winnerTeam = state.teams[state.winner];
    if (state.winner === inn2.battingTeamIndex) {
      const wicketsLeft = team2.players.length - 1 - inn2.wickets;
      resultText = `${winnerTeam.name} won by ${wicketsLeft} wicket${wicketsLeft !== 1 ? 's' : ''}! 🎉`;
    } else {
      const runDiff = inn1.score - inn2.score;
      resultText = `${winnerTeam.name} won by ${runDiff} run${runDiff !== 1 ? 's' : ''}! 🎉`;
    }
  }

  const oversStr = (totalBalls: number) => `${Math.floor(totalBalls / 6)}.${totalBalls % 6}`;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 max-w-lg mx-auto">
      <div className="text-6xl mb-4">🏆</div>
      <h2 className="text-2xl font-black text-primary text-center score-highlight mb-6">{resultText}</h2>

      <div className="w-full space-y-3">
        {[{ inn: inn1, team: team1 }, { inn: inn2, team: team2 }].map(({ inn, team }, i) => (
          <div key={i} className="bg-card rounded-xl p-4">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-foreground">{team.name}</span>
              <span className="text-2xl font-black text-foreground">
                {inn.score}/{inn.wickets}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">({oversStr(inn.totalBalls)} overs)</p>
            <div className="mt-2 space-y-0.5">
              {inn.batsmen.filter(b => b.balls > 0 || b.runs > 0).map((b, j) => (
                <div key={j} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{b.name} {b.isOut ? '' : '*'}</span>
                  <span className="text-foreground">{b.runs} ({b.balls})</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button onClick={onReset} className="mt-8 w-full h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90">
        <RotateCcw className="mr-2 h-5 w-5" /> New Match
      </Button>
    </div>
  );
}
