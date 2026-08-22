import type { ResourceSummary, VisualizationAgent, VisualizationState } from "../types/visualization";
import coderPortrait from "../assets/resource-agents/coder.png";
import criteriaPortrait from "../assets/resource-agents/criteria.png";
import judgePortrait from "../assets/resource-agents/judge.png";
import orchestratorPortrait from "../assets/resource-agents/orchestrator.png";
import reviewerPortrait from "../assets/resource-agents/reviewer.png";

type AgentResourcePanelProps = {
  agents: VisualizationAgent[];
  isOpen: boolean;
  issue: VisualizationState["issue"];
  onToggle: () => void;
  onRetry: () => void;
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

export function AgentResourcePanel({ agents, isOpen, issue, onRetry, onToggle, summary }: AgentResourcePanelProps) {
  return (
    <aside className="resource-panel" aria-label="에이전트와 자원">
      <div className="panel-heading">
        <h2>에이전트와 자원</h2>
        <button
          className="resource-panel-toggle"
          onClick={onToggle}
          type="button"
          aria-expanded={isOpen}
          aria-label="에이전트와 자원 닫기"
        >
          <span className="drawer-toggle-icon" />
        </button>
      </div>
      <div className="agent-card-list">
        {agents.map((agent) => (
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
              <span className="progress-track">
                <span
                  style={{
                    width: `${(agent.tokenUsed / agent.tokenLimit) * 100}%`,
                    backgroundColor: agent.accentColor,
                  }}
                />
              </span>
              <small>
                토큰 {(agent.tokenUsed / 1000).toFixed(1)}k / {(agent.tokenLimit / 1000).toFixed(0)}k
              </small>
            </div>
            <em className={statusTone[agent.status]}>{agent.statusLabel}</em>
          </article>
        ))}
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
      <section className="status-legend" aria-label="상태 아이콘 안내">
        <span><i className="legend-work" /> 작업 중</span>
        <span><i className="legend-idle" /> 대기 중</span>
        <span><i className="legend-done" /> 완료</span>
        <span><i className="legend-error" /> 문제 발생</span>
      </section>
      {issue.visible ? (
        <section className="issue-alert">
          <strong>{issue.message}</strong>
          <div>
            <button type="button">자세히 보기</button>
            <button onClick={onRetry} type="button">다시 시도</button>
          </div>
        </section>
      ) : null}
    </aside>
  );
}
