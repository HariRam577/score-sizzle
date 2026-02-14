import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import type { MatchState, InningsData, BatsmanStats, BowlerStats } from '@/types/cricket';

interface Props {
  state: MatchState;
  onReset: () => void;
}

export default function MatchResult({ state, onReset }: Props) {
  const inn1 = state.innings[0]!;
  const inn2 = state.innings[1]!;
  const team1 = state.teams[inn1.battingTeamIndex];
  const team2 = state.teams[inn2.battingTeamIndex];
  const [expanded, setExpanded] = useState<number>(0);

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

  const getSR = (runs: number, balls: number) => balls > 0 ? ((runs / balls) * 100).toFixed(1) : '0.0';
  const getEcon = (runs: number, overs: number, balls: number) => {
    const totalOvers = overs + balls / 6;
    return totalOvers > 0 ? (runs / totalOvers).toFixed(2) : '0.00';
  };

  const getDismissalText = (b: BatsmanStats) => {
    if (!b.isOut) return 'not out';
    const how = b.howOut || 'Bowled';
    const bowler = b.bowlerName || '';
    switch (how) {
      case 'Bowled': return `b ${bowler}`;
      case 'Caught': return `c & b ${bowler}`;
      case 'Caught Behind': return `c †wk b ${bowler}`;
      case 'LBW': return `lbw b ${bowler}`;
      case 'Stumped': return `st †wk b ${bowler}`;
      case 'Run Out': return 'run out';
      case 'Hit Wicket': return `hit wicket b ${bowler}`;
      default: return `${how} b ${bowler}`;
    }
  };

  const renderInningsCard = (inn: InningsData, battingTeam: { name: string; players: string[] }, bowlingTeam: { name: string; players: string[] }, idx: number) => {
    const isExpanded = expanded === idx;
    const rr = inn.totalBalls > 0 ? ((inn.score / inn.totalBalls) * 6).toFixed(2) : '0.00';

    return (
      <div key={idx} className="bg-card rounded-xl overflow-hidden border border-border">
        {/* Header */}
        <button
          onClick={() => setExpanded(isExpanded ? -1 : idx)}
          className="w-full flex items-center justify-between p-4 active:bg-secondary/50 transition-colors"
        >
          <div className="text-left">
            <h3 className="font-bold text-foreground text-lg">{battingTeam.name}</h3>
            <p className="text-xs text-muted-foreground">
              {idx === 0 ? '1st' : '2nd'} Innings • {oversStr(inn.totalBalls)} ov • RR {rr}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-foreground score-highlight">
              {inn.score}/{inn.wickets}
            </span>
            {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
          </div>
        </button>

        {isExpanded && (
          <div className="border-t border-border">
            {/* Batting */}
            <div className="p-3">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Batting</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-muted-foreground text-xs">
                      <th className="text-left pb-2 font-medium">Batter</th>
                      <th className="text-right pb-2 font-medium w-8">R</th>
                      <th className="text-right pb-2 font-medium w-8">B</th>
                      <th className="text-right pb-2 font-medium w-8">4s</th>
                      <th className="text-right pb-2 font-medium w-8">6s</th>
                      <th className="text-right pb-2 font-medium w-12">SR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inn.batsmen.map((b, j) => (
                      <tr key={j} className="border-t border-border/50">
                        <td className="py-2 pr-2">
                          <div className="font-semibold text-foreground text-sm">{b.name}</div>
                          <div className={`text-xs ${b.isOut ? 'text-destructive' : 'text-accent'}`}>
                            {getDismissalText(b)}
                          </div>
                        </td>
                        <td className="text-right py-2 font-bold text-foreground">{b.runs}</td>
                        <td className="text-right py-2 text-muted-foreground">{b.balls}</td>
                        <td className="text-right py-2 text-muted-foreground">{b.fours}</td>
                        <td className="text-right py-2 text-muted-foreground">{b.sixes}</td>
                        <td className="text-right py-2 text-muted-foreground">{getSR(b.runs, b.balls)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Extras & Total */}
              <div className="mt-2 pt-2 border-t border-border/50 flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Extras: {inn.score - inn.batsmen.reduce((s, b) => s + b.runs, 0)}
                </span>
                <span className="font-bold text-foreground">
                  Total: {inn.score}/{inn.wickets} ({oversStr(inn.totalBalls)} ov)
                </span>
              </div>
            </div>

            {/* Bowling */}
            <div className="p-3 border-t border-border">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Bowling</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-muted-foreground text-xs">
                      <th className="text-left pb-2 font-medium">Bowler</th>
                      <th className="text-right pb-2 font-medium w-8">O</th>
                      <th className="text-right pb-2 font-medium w-8">M</th>
                      <th className="text-right pb-2 font-medium w-8">R</th>
                      <th className="text-right pb-2 font-medium w-8">W</th>
                      <th className="text-right pb-2 font-medium w-12">Econ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inn.bowlers.map((bw, j) => (
                      <tr key={j} className="border-t border-border/50">
                        <td className="py-2 font-semibold text-foreground">{bw.name}</td>
                        <td className="text-right py-2 text-muted-foreground">
                          {bw.oversBowled}{bw.ballsBowled > 0 ? `.${bw.ballsBowled}` : ''}
                        </td>
                        <td className="text-right py-2 text-muted-foreground">{bw.maidens}</td>
                        <td className="text-right py-2 text-muted-foreground">{bw.runsConceded}</td>
                        <td className="text-right py-2 font-bold text-foreground">{bw.wickets}</td>
                        <td className="text-right py-2 text-muted-foreground">
                          {getEcon(bw.runsConceded, bw.oversBowled, bw.ballsBowled)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fall of Wickets */}
            {inn.batsmen.some(b => b.isOut) && (
              <div className="p-3 border-t border-border">
                <h4 className="text-xs font-bold text-destructive uppercase tracking-wider mb-2">Fall of Wickets</h4>
                <div className="flex flex-wrap gap-2">
                  {inn.batsmen.filter(b => b.isOut).map((b, j) => (
                    <span key={j} className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-md border border-destructive/20">
                      {b.name} • {b.howOut || 'Bowled'}{b.bowlerName ? ` (${b.bowlerName})` : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 max-w-lg mx-auto">
      {/* Result Banner */}
      <div className="text-center py-6">
        <div className="text-5xl mb-3">🏆</div>
        <h2 className="text-xl font-black text-primary score-highlight">{resultText}</h2>
      </div>

      {/* Innings Scorecards */}
      <div className="space-y-3 flex-1">
        {renderInningsCard(inn1, team1, state.teams[1 - inn1.battingTeamIndex], 0)}
        {renderInningsCard(inn2, team2, state.teams[1 - inn2.battingTeamIndex], 1)}
      </div>

      <Button onClick={onReset} className="mt-6 w-full h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90">
        <RotateCcw className="mr-2 h-5 w-5" /> New Match
      </Button>
    </div>
  );
}
