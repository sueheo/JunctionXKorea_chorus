import { useEffect, useMemo, useState } from "react";
import { ActivityLogPanel } from "./components/ActivityLogPanel";
import { AgentResourcePanel } from "./components/AgentResourcePanel";
import { CollaborationStage } from "./components/CollaborationStage";
import { ReasonPanel } from "./components/ReasonPanel";
import { StepProgress } from "./components/StepProgress";
import { TopRunBar } from "./components/TopRunBar";
import { mockReplay } from "./data/mockReplay";
import { createVisualizationState } from "./lib/squadEventAdapter";

function App() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);

  useEffect(() => {
    if (isPaused || isStopped || elapsedSeconds >= mockReplay.durationSeconds) {
      return;
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => Math.min(current + 1, mockReplay.durationSeconds));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [elapsedSeconds, isPaused, isStopped]);

  const visualization = useMemo(
    () =>
      createVisualizationState(mockReplay, {
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
      <section className="workspace" aria-label="RareSuSi squad visualization">
        <ActivityLogPanel agents={visualization.agents} logs={visualization.logs} />
        <section className="stage-column" aria-label="현재 협업 무대">
          <CollaborationStage agents={visualization.agents} />
          <StepProgress steps={visualization.steps} />
          <ReasonPanel reason={visualization.reason} />
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
