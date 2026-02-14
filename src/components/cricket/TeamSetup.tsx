<<<<<<< HEAD
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, ChevronRight } from "lucide-react";
import type { TeamInfo } from "@/types/cricket";
=======
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, ChevronRight } from 'lucide-react';
import type { TeamInfo } from '@/types/cricket';
>>>>>>> 7ca1dbf8850d48f8d3a55f0f733f90c6d08085a3

interface Props {
  onSubmit: (team1: TeamInfo, team2: TeamInfo, overs: number) => void;
}

<<<<<<< HEAD
const OVER_OPTIONS = [5, 6, 7, 8, 8, 10, 20, 50];

export default function TeamSetup({ onSubmit }: Props) {
  const [team1Name, setTeam1Name] = useState("");
  const [team2Name, setTeam2Name] = useState("");
  const [team1Players, setTeam1Players] = useState(["", ""]);
  const [team2Players, setTeam2Players] = useState(["", ""]);
=======
const OVER_OPTIONS = [5, 10, 20, 50];

export default function TeamSetup({ onSubmit }: Props) {
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [team1Players, setTeam1Players] = useState(['', '']);
  const [team2Players, setTeam2Players] = useState(['', '']);
>>>>>>> 7ca1dbf8850d48f8d3a55f0f733f90c6d08085a3
  const [overs, setOvers] = useState(20);

  const updatePlayer = (team: 1 | 2, idx: number, value: string) => {
    const setter = team === 1 ? setTeam1Players : setTeam2Players;
<<<<<<< HEAD
    setter((prev) => prev.map((p, i) => (i === idx ? value : p)));
=======
    setter(prev => prev.map((p, i) => i === idx ? value : p));
>>>>>>> 7ca1dbf8850d48f8d3a55f0f733f90c6d08085a3
  };

  const addPlayer = (team: 1 | 2) => {
    const setter = team === 1 ? setTeam1Players : setTeam2Players;
<<<<<<< HEAD
    setter((prev) => [...prev, ""]);
=======
    setter(prev => [...prev, '']);
>>>>>>> 7ca1dbf8850d48f8d3a55f0f733f90c6d08085a3
  };

  const removePlayer = (team: 1 | 2, idx: number) => {
    const setter = team === 1 ? setTeam1Players : setTeam2Players;
<<<<<<< HEAD
    setter((prev) => prev.filter((_, i) => i !== idx));
  };

  const isValid = () => {
    const t1Valid =
      team1Name.trim() && team1Players.filter((p) => p.trim()).length >= 2;
    const t2Valid =
      team2Name.trim() && team2Players.filter((p) => p.trim()).length >= 2;
=======
    setter(prev => prev.filter((_, i) => i !== idx));
  };

  const isValid = () => {
    const t1Valid = team1Name.trim() && team1Players.filter(p => p.trim()).length >= 2;
    const t2Valid = team2Name.trim() && team2Players.filter(p => p.trim()).length >= 2;
>>>>>>> 7ca1dbf8850d48f8d3a55f0f733f90c6d08085a3
    return t1Valid && t2Valid;
  };

  const handleSubmit = () => {
    if (!isValid()) return;
    onSubmit(
<<<<<<< HEAD
      {
        name: team1Name.trim(),
        players: team1Players.filter((p) => p.trim()).map((p) => p.trim()),
      },
      {
        name: team2Name.trim(),
        players: team2Players.filter((p) => p.trim()).map((p) => p.trim()),
      },
      overs,
    );
  };

  const renderTeamCard = (
    teamNum: 1 | 2,
    name: string,
    setName: (v: string) => void,
    players: string[],
  ) => (
    <div className="rounded-xl bg-card p-4 space-y-3">
      <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
        Team {teamNum}
      </h3>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
=======
      { name: team1Name.trim(), players: team1Players.filter(p => p.trim()).map(p => p.trim()) },
      { name: team2Name.trim(), players: team2Players.filter(p => p.trim()).map(p => p.trim()) },
      overs
    );
  };

  const renderTeamCard = (teamNum: 1 | 2, name: string, setName: (v: string) => void, players: string[]) => (
    <div className="rounded-xl bg-card p-4 space-y-3">
      <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Team {teamNum}</h3>
      <Input
        value={name}
        onChange={e => setName(e.target.value)}
>>>>>>> 7ca1dbf8850d48f8d3a55f0f733f90c6d08085a3
        placeholder={`Team ${teamNum} Name`}
        className="text-lg font-bold bg-secondary border-none placeholder:text-muted-foreground"
      />
      <div className="space-y-2">
<<<<<<< HEAD
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Players (min 2)
        </p>
=======
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Players (min 2)</p>
>>>>>>> 7ca1dbf8850d48f8d3a55f0f733f90c6d08085a3
        {players.map((p, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={p}
<<<<<<< HEAD
              onChange={(e) => updatePlayer(teamNum, i, e.target.value)}
=======
              onChange={e => updatePlayer(teamNum, i, e.target.value)}
>>>>>>> 7ca1dbf8850d48f8d3a55f0f733f90c6d08085a3
              placeholder={`Player ${i + 1}`}
              className="bg-secondary border-none"
            />
            {players.length > 2 && (
<<<<<<< HEAD
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removePlayer(teamNum, i)}
                className="shrink-0 text-muted-foreground hover:text-destructive"
              >
=======
              <Button variant="ghost" size="icon" onClick={() => removePlayer(teamNum, i)} className="shrink-0 text-muted-foreground hover:text-destructive">
>>>>>>> 7ca1dbf8850d48f8d3a55f0f733f90c6d08085a3
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        {players.length < 11 && (
<<<<<<< HEAD
          <Button
            variant="ghost"
            size="sm"
            onClick={() => addPlayer(teamNum)}
            className="text-primary"
          >
=======
          <Button variant="ghost" size="sm" onClick={() => addPlayer(teamNum)} className="text-primary">
>>>>>>> 7ca1dbf8850d48f8d3a55f0f733f90c6d08085a3
            <Plus className="h-4 w-4 mr-1" /> Add Player
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 pb-24 max-w-lg mx-auto">
      <div className="text-center mb-6 pt-6">
<<<<<<< HEAD
        <h1 className="text-3xl font-black text-primary score-highlight">
          🏏 Cricket Scorer
        </h1>
=======
        <h1 className="text-3xl font-black text-primary score-highlight">🏏 Cricket Scorer</h1>
>>>>>>> 7ca1dbf8850d48f8d3a55f0f733f90c6d08085a3
        <p className="text-muted-foreground text-sm mt-1">Set up your match</p>
      </div>

      <div className="space-y-4">
        {renderTeamCard(1, team1Name, setTeam1Name, team1Players)}
<<<<<<< HEAD
        <div className="text-center text-muted-foreground font-bold text-lg">
          VS
        </div>
        {renderTeamCard(2, team2Name, setTeam2Name, team2Players)}

        <div className="rounded-xl bg-card p-4">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Overs per Innings
          </p>
          <div className="grid grid-cols-4 gap-2">
            {OVER_OPTIONS.map((o) => (
              <Button
                key={o}
                variant={overs === o ? "default" : "secondary"}
                onClick={() => setOvers(o)}
                className={
                  overs === o ? "bg-primary text-primary-foreground" : ""
                }
=======
        <div className="text-center text-muted-foreground font-bold text-lg">VS</div>
        {renderTeamCard(2, team2Name, setTeam2Name, team2Players)}

        <div className="rounded-xl bg-card p-4">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Overs per Innings</p>
          <div className="grid grid-cols-4 gap-2">
            {OVER_OPTIONS.map(o => (
              <Button
                key={o}
                variant={overs === o ? 'default' : 'secondary'}
                onClick={() => setOvers(o)}
                className={overs === o ? 'bg-primary text-primary-foreground' : ''}
>>>>>>> 7ca1dbf8850d48f8d3a55f0f733f90c6d08085a3
              >
                {o}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-sm border-t border-border">
        <Button
          onClick={handleSubmit}
          disabled={!isValid()}
          className="w-full max-w-lg mx-auto flex h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
        >
          Continue to Toss <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
