import type { ResourceSummary, VisualizationAgent } from "../types/visualization";

type AgentResourcePanelProps = {
  agents: VisualizationAgent[];
  summary: ResourceSummary;
};

export function AgentResourcePanel({ agents, summary }: AgentResourcePanelProps) {
  return (
    <aside className="resource-panel" aria-label="에이전트와 자원">
      <div className="panel-heading">
        <h2>에이전트와 자원</h2>
      </div>
      <div className="agent-card-list">
        {agents.map((agent) => (
          <article className="agent-resource-card" key={agent.id}>
            <span className="agent-avatar large" style={{ backgroundColor: agent.color }} />
            <div>
              <strong>{agent.name}</strong>
              <p>{agent.description}</p>
              <span className="progress-track">
                <span style={{ width: `${(agent.tokenUsed / agent.tokenLimit) * 100}%` }} />
              </span>
            </div>
            <em>{agent.status}</em>
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
        </div>
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
