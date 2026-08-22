import type { VisualizationAgent } from "../types/visualization";
import stageAsset from "../assets/stage.png";

type CollaborationStageProps = {
  activeAgentId?: string;
  agents: VisualizationAgent[];
  stageMessage: string;
};

export function CollaborationStage({ activeAgentId, agents, stageMessage }: CollaborationStageProps) {
  return (
    <section className="collaboration-stage">
      <div className="stage-header">
        <div className="stage-title-row">
          <h1>현재 협업 무대</h1>
          <button className="info-button" type="button" aria-label="협업 무대 설명">i</button>
        </div>
        <p><span className="status-dot" /> {stageMessage}</p>
      </div>
      <div className="stage-area">
        <img alt="" aria-hidden="true" className="stage-image" src={stageAsset} />
        <div className="stage-tier top-tier" aria-label="상단 단상">
          {agents.slice(0, 2).map((agent) => (
            <AgentCharacter agent={agent} isActive={agent.id === activeAgentId} key={agent.id} />
          ))}
        </div>
        <div className="stage-tier bottom-tier" aria-label="하단 단상">
          {agents.slice(2).map((agent) => (
            <AgentCharacter agent={agent} isActive={agent.id === activeAgentId} key={agent.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AgentCharacter({ agent, isActive }: { agent: VisualizationAgent; isActive: boolean }) {
  return (
    <button className={`stage-agent ${agent.status} ${agent.role} ${isActive ? "is-active" : ""}`} type="button">
      {agent.assetSrc ? (
        <span className="agent-image-wrap">
          <img alt={`${agent.name} 캐릭터`} className="agent-image" src={agent.assetSrc} />
        </span>
      ) : (
        <span className="agent-blob" style={{ backgroundColor: agent.color }}>
          <span className="agent-face">
            <span className="eye left" />
            <span className="eye right" />
            <span className="mouth" />
          </span>
          <span className="agent-prop" aria-hidden="true" />
        </span>
      )}
      <strong>{agent.name}</strong>
    </button>
  );
}
