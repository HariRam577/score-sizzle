import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import type { MatchState, ScoringAction } from '@/types/cricket';
import ScoringButtons from './ScoringButtons';

interface Props {
  state: MatchState;
  onScore: (type: 'dot' | '1' | '2' | '3' | '4' | '6' | 'wide' | 'noball' | 'wicket') => void;
  onNewBatsman: (playerIndex: number) => void;
  onFinishMatch?: () => void;
}

export default function LiveMatch({ state, onScore, onNewBatsman, onFinishMatch }: Props) {
  const inn = state.innings[state.currentInnings]!;
  const battingTeam = state.teams[inn.battingTeamIndex];
  const bowlingTeam = state.teams[1 - inn.battingTeamIndex];
  const striker = inn.batsmen[inn.strikerIdx];
  const nonStriker = inn.batsmen[inn.nonStrikerIdx];
  const bowler = inn.bowlers[inn.currentBowlerIdx];
  const oversStr = `${Math.floor(inn.totalBalls / 6)}.${inn.totalBalls % 6}`;
  const rr = inn.totalBalls > 0 ? ((inn.score / inn.totalBalls) * 6).toFixed(2) : '0.00';

  const [flashClass, setFlashClass] = useState('');
  const [selectedBatsman, setSelectedBatsman] = useState<number | null>(null);

  useEffect(() => {
    if (flashClass) {
      const t = setTimeout(() => setFlashClass(''), 600);
      return () => clearTimeout(t);
    }
  }, [flashClass]);

  const handleScoringAction = (action: ScoringAction) => {
    switch (action.type) {
      case 'DOT': onScore('dot'); break;
      case 'RUNS': onScore(String(action.runs) as '1' | '2' | '3'); break;
      case 'FOUR': setFlashClass('boundary-flash'); onScore('4'); break;
      case 'SIX': setFlashClass('boundary-flash'); onScore('6'); break;
      case 'WIDE': onScore('wide'); break;
      case 'NOBALL': onScore('noball'); break;
      case 'BYE': onScore(String(action.runs) as '1' | '2' | '3'); break;
      case 'LEGBYE': onScore(String(action.runs) as '1' | '2' | '3'); break;
      case 'WICKET': setFlashClass('wicket-flash'); onScore('wicket'); break;
    }
  };

  const usedBatIndices = inn.batsmen.map(b => b.playerIndex);
  const availableBatsmen = battingTeam.players
    .map((name, i) => ({ name, i }))
    .filter(p => !usedBatIndices.includes(p.i));

  const confirmNewBatsman = () => {
    if (selectedBatsman !== null) {
      onNewBatsman(selectedBatsman);
      setSelectedBatsman(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      {/* Scoreboard */}
      <div className={`bg-card p-4 rounded-b-2xl ${flashClass}`}>
        <div className="flex items-baseline justify-between mb-1">
          <h2 className="text-lg font-black text-primary">{battingTeam.name}</h2>
          <span className="text-xs text-muted-foreground">
            {state.currentInnings === 0 ? '1st Innings' : '2nd Innings'}
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-black text-foreground score-highlight">
            {inn.score}/{inn.wickets}
          </span>
          <span className="text-lg text-muted-foreground">({oversStr})</span>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground mt-1">
          <span>RR: {rr}</span>
          {state.currentInnings === 1 && state.target && (
            <span className="text-primary font-semibold">
              Need {state.target - inn.score} from {state.oversPerInnings * 6 - inn.totalBalls} balls
            </span>
          )}
        </div>
      </div>

      {/* Batsmen */}
      <div className="px-4 mt-3 space-y-1">
        {[striker, nonStriker].map((bat, i) => (
          <div key={bat.playerIndex} className="flex items-center justify-between bg-card rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              {i === 0 && <span className="text-primary text-xs font-bold">*</span>}
              <span className="font-semibold text-foreground text-sm">{bat.name}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="font-bold text-foreground">{bat.runs}</span>
              <span className="text-muted-foreground">({bat.balls})</span>
              <span className="text-xs text-muted-foreground">{bat.fours}×4 {bat.sixes}×6</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bowler */}
      <div className="px-4 mt-2">
        <div className="flex items-center justify-between bg-card rounded-lg px-3 py-2">
          <span className="font-semibold text-foreground text-sm">{bowler.name}</span>
          <span className="text-sm text-muted-foreground">
            {bowler.oversBowled}.{bowler.ballsBowled}-{bowler.maidens}-{bowler.runsConceded}-{bowler.wickets}
          </span>
        </div>
      </div>

      {/* This Over */}
      <div className="px-4 mt-3">
        <div className="bg-card rounded-lg px-3 py-2">
          <p className="text-xs text-muted-foreground mb-1.5">This Over</p>
          <div className="flex gap-1.5 flex-wrap">
            {inn.currentOver.map((b, i) => (
              <span
                key={i}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold ${
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
            {inn.currentOver.length === 0 && <span className="text-muted-foreground text-xs">New over</span>}
          </div>
        </div>
      </div>

      {/* Scoring Buttons */}
      <div className="flex-1" />
      <ScoringButtons onScore={handleScoringAction} onFinishMatch={onFinishMatch || (() => {})} />

      {/* New Batsman Dialog */}
      <Dialog open={inn.needsNewBatsman} onOpenChange={() => {}}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">Select New Batsman</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            {availableBatsmen.map(p => (
              <button
                key={p.i}
                onClick={() => setSelectedBatsman(p.i)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                  selectedBatsman === p.i ? 'bg-primary/20 border-2 border-primary' : 'bg-secondary border-2 border-transparent'
                }`}
              >
                <span className="font-semibold text-foreground">{p.name}</span>
                {selectedBatsman === p.i && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
          <Button onClick={confirmNewBatsman} disabled={selectedBatsman === null} className="mt-2 bg-primary text-primary-foreground">
            Confirm
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
