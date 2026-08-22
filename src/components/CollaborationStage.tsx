import type { VisualizationAgent } from "../types/visualization";

type CollaborationStageProps = {
  agents: VisualizationAgent[];
};

export function CollaborationStage({ agents }: CollaborationStageProps) {
  return (
    <section className="collaboration-stage">
      <div className="stage-header">
        <div className="stage-title-row">
          <h1>현재 협업 무대</h1>
          <button className="info-button" type="button" aria-label="협업 무대 설명">i</button>
        </div>
        <p><span className="status-dot" /> 코드 수정과 검증이 동시에 진행 중이에요</p>
      </div>
      <div className="stage-area">
        <div className="stage-tier top-tier" aria-label="상단 단상">
          {agents.slice(0, 2).map((agent) => (
            <AgentCharacter agent={agent} key={agent.id} />
          ))}
        </div>
        <div className="stage-tier bottom-tier" aria-label="하단 단상">
          {agents.slice(2).map((agent) => (
            <AgentCharacter agent={agent} key={agent.id} />
          ))}
        </div>
        <div className="conductor-placeholder">
          <span className="conductor-head" />
          <strong>지휘자</strong>
        </div>
      </div>
    </section>
  );
}

function AgentCharacter({ agent }: { agent: VisualizationAgent }) {
  return (
    <button className={`stage-agent ${agent.status} ${agent.role}`} type="button">
      <span className="agent-blob" style={{ backgroundColor: agent.color }}>
        <span className="agent-face">
          <span className="eye left" />
          <span className="eye right" />
          <span className="mouth" />
        </span>
        <span className="agent-prop" aria-hidden="true" />
      </span>
      <strong>{agent.name}</strong>
    </button>
  );
}
