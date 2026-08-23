import type { ResourceSummary, VisualizationAgent } from "../types/visualization";
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
  summary: ResourceSummary;
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
  summary,
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
      <section className="resource-summary">
        <div>
          <span>전체 토큰</span>
          <strong>
            {(summary.totalTokens / 1000).toFixed(1)}k
            <span className="summary-limit"> / {(summary.tokenLimit / 1000).toFixed(0)}k</span>
          </strong>
          <span className="summary-progress">
            <span style={{ width: `${(summary.totalTokens / summary.tokenLimit) * 100}%` }} />
          </span>
        </div>
        <div>
          <span>예상 비용</span>
          <strong>₩{summary.estimatedCostKrw.toLocaleString("ko-KR")}</strong>
          <small>(약 $0.25)</small>
        </div>
      </section>
    </aside>
  );
}
