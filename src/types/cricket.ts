export interface BallEvent {
  runs: number;
  isWide: boolean;
  isNoBall: boolean;
  isWicket: boolean;
  batsmanRuns: number;
  extras: number;
  label: string;
}

export interface BatsmanStats {
  name: string;
  playerIndex: number;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
}

export interface BowlerStats {
  name: string;
  playerIndex: number;
  oversBowled: number;
  ballsBowled: number;
  runsConceded: number;
  wickets: number;
  maidens: number;
}

export interface TeamInfo {
  name: string;
  players: string[];
}

export interface InningsData {
  battingTeamIndex: number;
  score: number;
  wickets: number;
  totalBalls: number;
  overs: BallEvent[][];
  currentOver: BallEvent[];
  batsmen: BatsmanStats[];
  bowlers: BowlerStats[];
  strikerIdx: number;
  nonStrikerIdx: number;
  currentBowlerIdx: number;
  needsNewBatsman: boolean;
}

export type MatchPhase =
  | 'setup'
  | 'toss'
  | 'select-batting'
  | 'select-bowling'
  | 'playing'
  | 'new-bowler'
  | 'innings-break'
  | 'result';

export interface MatchState {
  phase: MatchPhase;
  teams: [TeamInfo, TeamInfo];
  oversPerInnings: number;
  tossWinner: number;
  battingFirst: number;
  currentInnings: number;
  innings: [InningsData | null, InningsData | null];
  lastCompletedOver: BallEvent[];
  winner: number | null;
  target: number | null;
}
