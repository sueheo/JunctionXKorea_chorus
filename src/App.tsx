import { useEffect, useMemo, useState } from "react";
import { ActivityLogPanel } from "./components/ActivityLogPanel";
import { AgentResourcePanel } from "./components/AgentResourcePanel";
import { CollaborationStage } from "./components/CollaborationStage";
import { HandoffTrail } from "./components/HandoffTrail";
import { TopRunBar } from "./components/TopRunBar";
import { replayScenarios, type ReplayScenarioId } from "./data/replayScenarios";
import { createVisualizationState } from "./lib/squadEventAdapter";

function App() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<ReplayScenarioId>("success");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isActivityPanelOpen, setIsActivityPanelOpen] = useState(true);
  const [isResourcePanelOpen, setIsResourcePanelOpen] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const activeReplay = useMemo(
    () => replayScenarios.find((scenario) => scenario.id === selectedScenarioId)?.replay ?? replayScenarios[0].replay,
    [selectedScenarioId],
  );
  const hasReplayEnded = elapsedSeconds >= activeReplay.durationSeconds;

  useEffect(() => {
    if (isPaused || isStopped || elapsedSeconds >= activeReplay.durationSeconds) {
      return;
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => Math.min(current + 1, activeReplay.durationSeconds));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activeReplay.durationSeconds, elapsedSeconds, isPaused, isStopped]);

  const visualization = useMemo(
    () =>
      createVisualizationState(activeReplay, {
        elapsedSeconds,
        isPaused,
        isStopped,
      }),
    [activeReplay, elapsedSeconds, isPaused, isStopped],
  );

  const resetReplay = () => {
    setElapsedSeconds(0);
    setIsPaused(false);
    setIsStopped(false);
  };

  const handleScenarioChange = (scenarioId: ReplayScenarioId) => {
    setSelectedScenarioId(scenarioId);
    setElapsedSeconds(0);
    setIsPaused(false);
    setIsStopped(false);
  };

  const handlePrimaryControl = () => {
    if (isStopped || hasReplayEnded) {
      resetReplay();
      return;
    }

    setIsPaused((current) => !current);
  };

  const handleStop = () => {
    setIsStopped(true);
    setIsPaused(false);
  };

  return (
    <main className="app-shell">
      <TopRunBar
        onPrimaryControl={handlePrimaryControl}
        onScenarioChange={handleScenarioChange}
        onStop={handleStop}
        run={visualization.run}
        scenarioId={selectedScenarioId}
        scenarios={replayScenarios}
      />
      <section
        className={`workspace ${isActivityPanelOpen ? "activity-open" : "activity-collapsed"} ${
          isResourcePanelOpen ? "resource-open" : "resource-collapsed"
        }`}
        aria-label="RareSuSi squad visualization"
      >
        <button
          className="activity-drawer-opener"
          onClick={() => setIsActivityPanelOpen(true)}
          type="button"
          aria-expanded={isActivityPanelOpen}
          aria-label="활동 로그 열기"
        >
          <span className="drawer-toggle-icon" />
          <span>활동 로그 보기</span>
        </button>
        <ActivityLogPanel
          agents={visualization.agents}
          isOpen={isActivityPanelOpen}
          latestLogId={visualization.latestLogId}
          logs={visualization.logs}
          onToggle={() => setIsActivityPanelOpen((current) => !current)}
          rawTraceLogs={visualization.rawTraceLogs}
        />
        <button
          className="resource-drawer-opener"
          onClick={() => setIsResourcePanelOpen(true)}
          type="button"
          aria-expanded={isResourcePanelOpen}
          aria-label="에이전트와 자원 열기"
        >
          <span className="drawer-toggle-icon" />
          <span>에이전트 보기</span>
        </button>
        <section className="stage-column" aria-label="현재 협업 무대">
          <CollaborationStage
            activeAgentId={visualization.activeAgentId}
            agents={visualization.agents}
            stageMessage={visualization.stageMessage}
          />
          <HandoffTrail agents={visualization.agents} nodes={visualization.handoffTrail} />
        </section>
        <AgentResourcePanel
          agents={visualization.agents}
          isOpen={isResourcePanelOpen}
          onToggle={() => setIsResourcePanelOpen((current) => !current)}
          summary={visualization.summary}
        />
      </section>
    </main>
  );
}

export default App;
