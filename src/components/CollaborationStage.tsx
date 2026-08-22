import type { VisualizationAgent } from "../types/visualization";

type CollaborationStageProps = {
  agents: VisualizationAgent[];
};

export function CollaborationStage({ agents }: CollaborationStageProps) {
  return (
    <section className="collaboration-stage">
      <div className="stage-header">
        <h1>현재 협업 무대</h1>
        <p><span className="status-dot" /> 코드 수정과 검증이 동시에 진행 중이에요</p>
      </div>
      <div className="stage-area">
        <div className="stage-tier top-tier">
          {agents.slice(0, 2).map((agent) => (
            <AgentCharacter agent={agent} key={agent.id} />
          ))}
        </div>
        <div className="stage-tier bottom-tier">
          {agents.slice(2).map((agent) => (
            <AgentCharacter agent={agent} key={agent.id} />
          ))}
        </div>
        <div className="conductor-placeholder">
          <span>지휘자</span>
        </div>
      </div>
    </section>
  );
}

function AgentCharacter({ agent }: { agent: VisualizationAgent }) {
  return (
    <button className={`stage-agent ${agent.status}`} type="button">
      <span className="agent-blob" style={{ backgroundColor: agent.color }}>
        {agent.name.slice(0, 1)}
      </span>
      <strong>{agent.name}</strong>
    </button>
  );
}
