import { useEffect, useMemo, useState } from "react";
import { ActivityLogPanel } from "./components/ActivityLogPanel";
import { AgentResourcePanel } from "./components/AgentResourcePanel";
import { CollaborationStage } from "./components/CollaborationStage";
import { TopRunBar } from "./components/TopRunBar";
import { goSampleReplay } from "./data/goSampleReplay";
import { createVisualizationState } from "./lib/squadEventAdapter";

const activeReplay = goSampleReplay;

function App() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isActivityPanelOpen, setIsActivityPanelOpen] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);

  useEffect(() => {
    if (isPaused || isStopped || elapsedSeconds >= activeReplay.durationSeconds) {
      return;
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => Math.min(current + 1, activeReplay.durationSeconds));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [elapsedSeconds, isPaused, isStopped]);

  const visualization = useMemo(
    () =>
      createVisualizationState(activeReplay, {
        elapsedSeconds,
        isPaused,
        isStopped,
      }),
    [elapsedSeconds, isPaused, isStopped],
  );

  const handleRetry = () => {
    setElapsedSeconds(0);
    setIsPaused(false);
    setIsStopped(false);
  };

  return (
    <main className="app-shell">
      <TopRunBar
        onStop={() => setIsStopped(true)}
        onTogglePause={() => setIsPaused((current) => !current)}
        run={visualization.run}
      />
      <section
        className={`workspace ${isActivityPanelOpen ? "activity-open" : "activity-collapsed"}`}
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
        />
        <section className="stage-column" aria-label="현재 협업 무대">
          <CollaborationStage
            activeAgentId={visualization.activeAgentId}
            agents={visualization.agents}
            stageMessage={visualization.stageMessage}
          />
        </section>
        <AgentResourcePanel
          agents={visualization.agents}
          issue={visualization.issue}
          onRetry={handleRetry}
          summary={visualization.summary}
        />
      </section>
    </main>
  );
}

export default App;
