import { useState, useCallback } from 'react';
import type { MatchState, InningsData, BatsmanStats, BowlerStats, TeamInfo, BallEvent, MatchPhase } from '@/types/cricket';
import { playCelebrationSound } from '@/utils/celebration-sound';

const createInitialState = (): MatchState => ({
  phase: 'setup',
  teams: [{ name: '', players: [] }, { name: '', players: [] }],
  oversPerInnings: 20,
  tossWinner: 0,
  battingFirst: 0,
  currentInnings: 0,
  innings: [null, null],
  lastCompletedOver: [],
  winner: null,
  target: null,
});

export function useMatch() {
  const [state, setState] = useState<MatchState>(createInitialState);

  const setupTeams = useCallback((team1: TeamInfo, team2: TeamInfo, overs: number) => {
    setState(s => ({ ...s, teams: [team1, team2], oversPerInnings: overs, phase: 'toss' as MatchPhase }));
  }, []);

  const doToss = useCallback((winner: number, electsBatting: boolean) => {
    setState(s => ({
      ...s,
      tossWinner: winner,
      battingFirst: electsBatting ? winner : 1 - winner,
      currentInnings: 0,
      phase: 'select-batting' as MatchPhase,
    }));
  }, []);

  const selectOpeners = useCallback((openerIndices: [number, number]) => {
    setState(s => {
      const battingTeamIdx = s.currentInnings === 0 ? s.battingFirst : 1 - s.battingFirst;
      const team = s.teams[battingTeamIdx];
      const batsmen: BatsmanStats[] = openerIndices.map(idx => ({
        name: team.players[idx], playerIndex: idx,
        runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false,
      }));
      const innings: InningsData = {
        battingTeamIndex: battingTeamIdx, score: 0, wickets: 0, totalBalls: 0,
        overs: [], currentOver: [], batsmen, bowlers: [],
        strikerIdx: 0, nonStrikerIdx: 1, currentBowlerIdx: -1, needsNewBatsman: false,
      };
      const newInnings = [...s.innings] as [InningsData | null, InningsData | null];
      newInnings[s.currentInnings] = innings;
      return { ...s, innings: newInnings, phase: 'select-bowling' as MatchPhase };
    });
  }, []);

  const selectBowler = useCallback((bowlerPlayerIndex: number) => {
    setState(s => {
      const innIdx = s.currentInnings;
      const inn = { ...s.innings[innIdx]! };
      const bowlingTeamIdx = 1 - inn.battingTeamIndex;
      const team = s.teams[bowlingTeamIdx];
      const bowlers = [...inn.bowlers];
      let bowlerIdx = bowlers.findIndex(b => b.playerIndex === bowlerPlayerIndex);
      if (bowlerIdx === -1) {
        bowlers.push({
          name: team.players[bowlerPlayerIndex], playerIndex: bowlerPlayerIndex,
          oversBowled: 0, ballsBowled: 0, runsConceded: 0, wickets: 0, maidens: 0,
        });
        bowlerIdx = bowlers.length - 1;
      }
      const newInn = { ...inn, bowlers, currentBowlerIdx: bowlerIdx };
      const newInnings = [...s.innings] as [InningsData | null, InningsData | null];
      newInnings[innIdx] = newInn;
      return { ...s, innings: newInnings, phase: 'playing' as MatchPhase };
    });
  }, []);

  const scoreBall = useCallback((type: 'dot' | '1' | '2' | '3' | '4' | '6' | 'wide' | 'noball' | 'wicket') => {
    if (type === '4' || type === '6') playCelebrationSound();

    setState(s => {
      const innIdx = s.currentInnings;
      const inn = { ...s.innings[innIdx]! };
      const batsmen = inn.batsmen.map(b => ({ ...b }));
      const bowlers = inn.bowlers.map(b => ({ ...b }));
      const striker = batsmen[inn.strikerIdx];
      const bowler = bowlers[inn.currentBowlerIdx];

      let totalRuns = 0, batsmanRuns = 0, extras = 0;
      let isLegal = true, isWicket = false, label = '';

      switch (type) {
        case 'dot': label = '•'; break;
        case '1': totalRuns = 1; batsmanRuns = 1; label = '1'; break;
        case '2': totalRuns = 2; batsmanRuns = 2; label = '2'; break;
        case '3': totalRuns = 3; batsmanRuns = 3; label = '3'; break;
        case '4': totalRuns = 4; batsmanRuns = 4; label = '4'; break;
        case '6': totalRuns = 6; batsmanRuns = 6; label = '6'; break;
        case 'wide': totalRuns = 1; extras = 1; isLegal = false; label = 'WD'; break;
        case 'noball': totalRuns = 1; extras = 1; isLegal = false; label = 'NB'; break;
        case 'wicket': isWicket = true; label = 'W'; break;
      }

      inn.score += totalRuns;
      if (isLegal) striker.balls += 1;
      if (!isWicket && type !== 'wide' && type !== 'noball') {
        striker.runs += batsmanRuns;
        if (batsmanRuns === 4) striker.fours += 1;
        if (batsmanRuns === 6) striker.sixes += 1;
      }
      if (isLegal) bowler.ballsBowled += 1;
      bowler.runsConceded += totalRuns;
      if (isWicket) bowler.wickets += 1;

      const ball: BallEvent = { runs: totalRuns, isWide: type === 'wide', isNoBall: type === 'noball', isWicket, batsmanRuns, extras, label };
      inn.currentOver = [...inn.currentOver, ball];
      if (isLegal) inn.totalBalls += 1;

      const endInnings = (currentInn: InningsData, bats: BatsmanStats[], bowl: BowlerStats[], lastOver: BallEvent[]) => {
        currentInn.batsmen = bats;
        currentInn.bowlers = bowl;
        const newInnings = [...s.innings] as [InningsData | null, InningsData | null];
        newInnings[innIdx] = currentInn;
        if (innIdx === 0) {
          return { ...s, innings: newInnings, phase: 'innings-break' as MatchPhase, target: currentInn.score + 1, lastCompletedOver: lastOver };
        }
        const firstScore = s.innings[0]!.score;
        let winner: number | null;
        if (currentInn.score > firstScore) winner = currentInn.battingTeamIndex;
        else if (currentInn.score < firstScore) winner = 1 - currentInn.battingTeamIndex;
        else winner = -1;
        return { ...s, innings: newInnings, phase: 'result' as MatchPhase, winner, lastCompletedOver: lastOver };
      };

      if (isWicket) {
        striker.isOut = true;
        inn.wickets += 1;
        const totalPlayers = s.teams[inn.battingTeamIndex].players.length;
        if (inn.wickets >= totalPlayers - 1) {
          return endInnings(inn, batsmen, bowlers, inn.currentOver);
        }
        inn.needsNewBatsman = true;
      }

      if (!isWicket && isLegal && batsmanRuns % 2 === 1) {
        const temp = inn.strikerIdx;
        inn.strikerIdx = inn.nonStrikerIdx;
        inn.nonStrikerIdx = temp;
      }

      const legalBallsInOver = inn.currentOver.filter(b => !b.isWide && !b.isNoBall).length;
      if (legalBallsInOver >= 6) {
        inn.overs = [...inn.overs, inn.currentOver];
        const lastOver = [...inn.currentOver];
        bowler.oversBowled += 1;
        bowler.ballsBowled = 0;
        const overRuns = lastOver.reduce((sum, b) => sum + b.runs, 0);
        if (overRuns === 0) bowler.maidens += 1;

        if (!isWicket) {
          const temp = inn.strikerIdx;
          inn.strikerIdx = inn.nonStrikerIdx;
          inn.nonStrikerIdx = temp;
        }
        inn.currentOver = [];

        if (inn.overs.length >= s.oversPerInnings) {
          return endInnings(inn, batsmen, bowlers, lastOver);
        }

        inn.batsmen = batsmen;
        inn.bowlers = bowlers;
        const newInnings = [...s.innings] as [InningsData | null, InningsData | null];
        newInnings[innIdx] = inn;
        return { ...s, innings: newInnings, phase: 'new-bowler' as MatchPhase, lastCompletedOver: lastOver };
      }

      if (innIdx === 1 && s.target && inn.score >= s.target) {
        inn.batsmen = batsmen;
        inn.bowlers = bowlers;
        const newInnings = [...s.innings] as [InningsData | null, InningsData | null];
        newInnings[innIdx] = inn;
        return { ...s, innings: newInnings, phase: 'result' as MatchPhase, winner: inn.battingTeamIndex };
      }

      inn.batsmen = batsmen;
      inn.bowlers = bowlers;
      const newInnings = [...s.innings] as [InningsData | null, InningsData | null];
      newInnings[innIdx] = inn;
      return { ...s, innings: newInnings };
    });
  }, []);

  const selectNewBatsman = useCallback((playerIndex: number) => {
    setState(s => {
      const innIdx = s.currentInnings;
      const inn = { ...s.innings[innIdx]! };
      const team = s.teams[inn.battingTeamIndex];
      const batsmen = [...inn.batsmen, {
        name: team.players[playerIndex], playerIndex,
        runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false,
      }];
      const newInnings = [...s.innings] as [InningsData | null, InningsData | null];
      newInnings[innIdx] = { ...inn, batsmen, strikerIdx: batsmen.length - 1, needsNewBatsman: false };
      return { ...s, innings: newInnings };
    });
  }, []);

  const startSecondInnings = useCallback(() => {
    setState(s => ({ ...s, currentInnings: 1, phase: 'select-batting' as MatchPhase }));
  }, []);

  const resetMatch = useCallback(() => {
    setState(createInitialState());
  }, []);

  return { state, setupTeams, doToss, selectOpeners, selectBowler, scoreBall, selectNewBatsman, startSecondInnings, resetMatch };
}
