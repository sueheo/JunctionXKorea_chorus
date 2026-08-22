import { ActivityLogPanel } from "./components/ActivityLogPanel";
import { AgentResourcePanel } from "./components/AgentResourcePanel";
import { CollaborationStage } from "./components/CollaborationStage";
import { ReasonPanel } from "./components/ReasonPanel";
import { StepProgress } from "./components/StepProgress";
import { TopRunBar } from "./components/TopRunBar";
import { mockReplay } from "./data/mockReplay";
import { createInitialVisualizationState } from "./lib/squadEventAdapter";

const visualization = createInitialVisualizationState(mockReplay);

function App() {
  return (
    <main className="app-shell">
      <TopRunBar run={visualization.run} />
      <section className="workspace" aria-label="RareSuSi squad visualization">
        <ActivityLogPanel agents={visualization.agents} logs={visualization.logs} />
        <section className="stage-column" aria-label="현재 협업 무대">
          <CollaborationStage agents={visualization.agents} />
          <StepProgress steps={visualization.steps} />
          <ReasonPanel reason={visualization.reason} />
        </section>
        <AgentResourcePanel agents={visualization.agents} summary={visualization.summary} />
      </section>
    </main>
  );
}

export default App;
