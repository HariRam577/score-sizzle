import { useMatch } from '@/hooks/useMatch';
import TeamSetup from '@/components/cricket/TeamSetup';
import TossScreen from '@/components/cricket/TossScreen';
import PlayerSelection from '@/components/cricket/PlayerSelection';
import LiveMatch from '@/components/cricket/LiveMatch';
import OverSummarySheet from '@/components/cricket/OverSummarySheet';
import InningsBreak from '@/components/cricket/InningsBreak';
import MatchResult from '@/components/cricket/MatchResult';

const Index = () => {
  const { state, setupTeams, doToss, selectOpeners, selectBowler, scoreBall, selectNewBatsman, startSecondInnings, resetMatch } = useMatch();

  const getBattingTeamIdx = () => state.currentInnings === 0 ? state.battingFirst : 1 - state.battingFirst;
  const getBowlingTeamIdx = () => 1 - getBattingTeamIdx();

  switch (state.phase) {
    case 'setup':
      return <TeamSetup onSubmit={setupTeams} />;

    case 'toss':
      return <TossScreen teams={state.teams} onToss={doToss} />;

    case 'select-batting':
      return (
        <PlayerSelection
          mode="openers"
          team={state.teams[getBattingTeamIdx()]}
          teamLabel={state.teams[getBattingTeamIdx()].name}
          onSelect={(indices) => selectOpeners(indices as [number, number])}
        />
      );

    case 'select-bowling':
      return (
        <PlayerSelection
          mode="bowler"
          team={state.teams[getBowlingTeamIdx()]}
          teamLabel={state.teams[getBowlingTeamIdx()].name}
          onSelect={(indices) => selectBowler(indices[0])}
        />
      );

    case 'playing':
      return <LiveMatch state={state} onScore={scoreBall} onNewBatsman={selectNewBatsman} />;

    case 'new-bowler':
      return <OverSummarySheet state={state} onSelectBowler={selectBowler} />;

    case 'innings-break':
      return <InningsBreak state={state} onStart={startSecondInnings} />;

    case 'result':
      return <MatchResult state={state} onReset={resetMatch} />;

    default:
      return null;
  }
};

export default Index;
