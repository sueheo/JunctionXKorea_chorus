import type { ResourceSummary, VisualizationAgent } from "../types/visualization";

type AgentResourcePanelProps = {
  agents: VisualizationAgent[];
  summary: ResourceSummary;
};

const statusTone = {
  idle: "idle",
  ready: "working",
  working: "working",
  completed: "completed",
  error: "error",
};

export function AgentResourcePanel({ agents, summary }: AgentResourcePanelProps) {
  return (
    <aside className="resource-panel" aria-label="에이전트와 자원">
      <div className="panel-heading">
        <h2>에이전트와 자원</h2>
        <button className="info-button" type="button" aria-label="에이전트와 자원 설명">i</button>
      </div>
      <div className="agent-card-list">
        {agents.map((agent) => (
          <article className="agent-resource-card" key={agent.id}>
            <span className={`agent-avatar large ${agent.role}`} style={{ backgroundColor: agent.color }}>
              {agent.name.slice(0, 1)}
            </span>
            <div>
              <strong>{agent.name}</strong>
              <p>{agent.currentTask}</p>
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
            {(summary.totalTokens / 1000).toFixed(1)}k / {(summary.tokenLimit / 1000).toFixed(0)}k
          </strong>
        </div>
        <div>
          <span>예상 비용</span>
          <strong>₩ {summary.estimatedCostKrw.toLocaleString("ko-KR")}</strong>
          <small>(약 $0.25)</small>
        </div>
      </section>
      <section className="status-legend" aria-label="상태 아이콘 안내">
        <span><i className="legend-work" /> 작업 중</span>
        <span><i className="legend-idle" /> 대기 중</span>
        <span><i className="legend-done" /> 완료</span>
        <span><i className="legend-error" /> 문제 발생</span>
      </section>
      <section className="issue-alert">
        <strong>검사에서 문제 1개 발견</strong>
        <div>
          <button type="button">자세히 보기</button>
          <button type="button">다시 시도</button>
        </div>
      </section>
    </aside>
  );
}
