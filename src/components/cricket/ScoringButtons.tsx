import { useState } from 'react';
import type { ScoringAction } from '@/types/cricket';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ScoringButtonsProps {
  onScore: (action: ScoringAction) => void;
  onFinishMatch: () => void;
}

const ScoringButtons = ({ onScore, onFinishMatch }: ScoringButtonsProps) => {
  const [showExtras, setShowExtras] = useState(false);
  const [showWicket, setShowWicket] = useState(false);
  const [wicketType, setWicketType] = useState('Bowled');
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [extraRuns, setExtraRuns] = useState(0);

  const wicketTypes = ['Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped', 'Hit Wicket', 'Caught Behind'];

  return (
    <div className="px-4 pb-6 pt-4 space-y-2">
      {/* Main scoring - runs */}
      <div className="grid grid-cols-4 gap-2">
        <Button
          onClick={() => onScore({ type: 'DOT' })}
          className="h-14 rounded-lg bg-dot text-muted-foreground font-bold text-lg active:scale-95 transition-transform"
        >
          0
        </Button>
        {[1, 2, 3].map(r => (
          <Button
            key={r}
            onClick={() => onScore({ type: 'RUNS', runs: r })}
            className="h-14 rounded-lg bg-secondary text-secondary-foreground font-bold text-lg active:scale-95 transition-transform"
          >
            {r}
          </Button>
        ))}
      </div>

      {/* Boundaries */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={() => onScore({ type: 'FOUR' })}
          className="h-14 rounded-lg bg-boundary-four text-primary-foreground font-bold text-xl active:scale-95 transition-transform"
        >
          4 FOUR
        </Button>
        <Button
          onClick={() => onScore({ type: 'SIX' })}
          className="h-14 rounded-lg bg-boundary-six text-primary-foreground font-bold text-xl active:scale-95 transition-transform"
        >
          6 SIX
        </Button>
      </div>

      {/* Extras and Wicket */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          onClick={() => setShowExtras(true)}
          className="h-12 rounded-lg bg-extra/20 text-extra border border-extra/30 font-bold text-sm active:scale-95 transition-transform"
        >
          EXTRAS
        </Button>
        <Button
          onClick={() => setShowWicket(true)}
          className="h-12 rounded-lg bg-wicket/20 text-wicket border border-wicket/30 font-bold text-sm active:scale-95 transition-transform"
        >
          WICKET
        </Button>
        <Button
          onClick={() => setShowFinishConfirm(true)}
          className="h-12 rounded-lg bg-muted text-muted-foreground font-bold text-sm active:scale-95 transition-transform"
        >
          END MATCH
        </Button>
      </div>

      {/* Extras Dialog */}
      <Dialog open={showExtras} onOpenChange={setShowExtras}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">Extras</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Additional Runs</p>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map(r => (
                  <Button
                    key={r}
                    onClick={() => setExtraRuns(r)}
                    className={`w-10 h-10 rounded-lg font-bold text-sm ${extraRuns === r ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                  >
                    {r}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => { onScore({ type: 'WIDE', runs: extraRuns }); setShowExtras(false); setExtraRuns(0); }}
                className="bg-extra/20 text-extra border border-extra/30"
              >
                Wide
              </Button>
              <Button
                onClick={() => { onScore({ type: 'NOBALL', runs: extraRuns }); setShowExtras(false); setExtraRuns(0); }}
                className="bg-extra/20 text-extra border border-extra/30"
              >
                No Ball
              </Button>
              <Button
                onClick={() => { onScore({ type: 'BYE', runs: Math.max(1, extraRuns) }); setShowExtras(false); setExtraRuns(0); }}
                className="bg-secondary text-secondary-foreground"
              >
                Bye
              </Button>
              <Button
                onClick={() => { onScore({ type: 'LEGBYE', runs: Math.max(1, extraRuns) }); setShowExtras(false); setExtraRuns(0); }}
                className="bg-secondary text-secondary-foreground"
              >
                Leg Bye
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Wicket Dialog */}
      <Dialog open={showWicket} onOpenChange={setShowWicket}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-destructive">Wicket!</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {wicketTypes.map(w => (
              <button
                key={w}
                onClick={() => setWicketType(w)}
                className={`w-full py-2.5 px-3 rounded-lg text-left text-sm transition-colors ${
                  wicketType === w
                    ? 'bg-destructive/20 text-destructive border-2 border-destructive/40'
                    : 'bg-secondary text-secondary-foreground border-2 border-transparent'
                }`}
              >
                {w}
              </button>
            ))}
            <Button
              onClick={() => { onScore({ type: 'WICKET', howOut: wicketType }); setShowWicket(false); }}
              className="w-full bg-destructive text-destructive-foreground"
            >
              Confirm Wicket
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Finish Match Confirm */}
      <Dialog open={showFinishConfirm} onOpenChange={setShowFinishConfirm}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">End Match?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to end the match now?</p>
          <div className="flex gap-2 mt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowFinishConfirm(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-destructive text-destructive-foreground"
              onClick={() => { onFinishMatch(); setShowFinishConfirm(false); }}
            >
              End Match
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScoringButtons;
