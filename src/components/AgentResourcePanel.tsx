import type { VisualizationAgent } from "../types/visualization";
import { formatTokenCount, getAgentTokenUsage } from "../lib/tokenModels";
import coderPortrait from "../assets/resource-agents/coder.png";
import criteriaPortrait from "../assets/resource-agents/criteria.png";
import judgePortrait from "../assets/resource-agents/judge.png";
import orchestratorPortrait from "../assets/resource-agents/orchestrator.png";
import reviewerPortrait from "../assets/resource-agents/reviewer.png";

type AgentResourcePanelProps = {
  agents: VisualizationAgent[];
  isOpen: boolean;
  onToggle: () => void;
};

const statusTone = {
  idle: "idle",
  ready: "working",
  working: "working",
  completed: "completed",
  error: "error",
};

const resourcePortraits: Partial<Record<VisualizationAgent["role"], string>> = {
  coder: coderPortrait,
  criteria: criteriaPortrait,
  judge: judgePortrait,
  orchestrator: orchestratorPortrait,
  reviewer: reviewerPortrait,
};

export function AgentResourcePanel({
  agents,
  isOpen,
  onToggle,
}: AgentResourcePanelProps) {
  return (
    <aside className="resource-panel" aria-label="에이전트와 자원">
      <div className="panel-heading">
        <h2>에이전트와 자원</h2>
        <button
          className="activity-panel-toggle"
          onClick={onToggle}
          type="button"
          aria-expanded={isOpen}
          aria-label="활동 로그 닫기"
        >
          <span className="drawer-toggle-icon" />
        </button>
      </div>
      <div className="agent-card-list">
        {agents.map((agent) => {
          const tokenUsage = getAgentTokenUsage(agent);

          return (
            <article className="agent-resource-card" key={agent.id}>
              <span className="resource-agent-portrait">
                {resourcePortraits[agent.role] ? (
                  <img alt={`${agent.name} 캐릭터`} src={resourcePortraits[agent.role]} />
                ) : (
                  <span className={`agent-avatar large ${agent.role}`} style={{ backgroundColor: agent.color }}>
                    {agent.name.slice(0, 1)}
                  </span>
                )}
              </span>
              <div>
                <strong>{agent.name}</strong>
                <p>{agent.description}</p>
                <span className="progress-track" aria-label={`${agent.name} 토큰 사용량`}>
                  <span
                    style={{
                      width: `${tokenUsage.percent}%`,
                      backgroundColor: agent.accentColor,
                    }}
                  />
                </span>
                <div className="token-meter-row">
                  <small>
                    토큰 {formatTokenCount(tokenUsage.weightedUsed)} / {formatTokenCount(tokenUsage.weightedLimit)}
                  </small>
                  <span>
                    {tokenUsage.modelLabel} x{tokenUsage.multiplier}
                  </span>
                </div>
              </div>
              <em className={statusTone[agent.status]}>{agent.statusLabel}</em>
            </article>
          );
        })}
      </div>
    </aside>
  );
}
