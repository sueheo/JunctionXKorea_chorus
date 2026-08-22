import type { VisualizationAgent, VisualizationLog } from "../types/visualization";

type ActivityLogPanelProps = {
  agents: VisualizationAgent[];
  logs: VisualizationLog[];
};

const iconLabels = {
  music: "작업 중",
  sleep: "대기 중",
  check: "완료",
  issue: "문제 발생",
};

export function ActivityLogPanel({ agents, logs }: ActivityLogPanelProps) {
  const groups = logs.reduce<Record<string, VisualizationLog[]>>((acc, log) => {
    acc[log.timeGroup] = [...(acc[log.timeGroup] ?? []), log];
    return acc;
  }, {});
  const agentById = Object.fromEntries(agents.map((agent) => [agent.id, agent]));

  return (
    <aside className="activity-panel" aria-label="Easy activity log">
      <div className="panel-heading">
        <h2>Easy activity log</h2>
        <button type="button">기술 로그 보기</button>
      </div>
      <div className="filter-row" aria-label="로그 필터">
        <button className="active" type="button">전체</button>
        <button type="button">진행</button>
        <button type="button">완료</button>
        <button type="button">문제</button>
      </div>
      <div className="log-groups">
        {Object.entries(groups).map(([timeGroup, groupLogs]) => (
          <section className="log-group" key={timeGroup}>
            <h3>
              <span className="clock-dot" />
              {timeGroup} ({groupLogs.length})
            </h3>
            {groupLogs.map((log) => (
              <article className="log-item" key={log.id}>
                <span
                  className={`agent-avatar mini-character ${log.agentId}`}
                  style={{ backgroundColor: agentById[log.agentId]?.color }}
                >
                  {log.agentName.slice(0, 1)}
                </span>
                <div>
                  <strong>{log.agentName}</strong>
                  <p>{log.message}</p>
                </div>
                <span className={`status-token ${log.icon}`} aria-label={iconLabels[log.icon]} />
              </article>
            ))}
          </section>
        ))}
      </div>
      <div className="log-hint">
        <span>!</span>
        에이전트 아이콘을 클릭하면 로그를 필터링할 수 있어요
      </div>
    </aside>
  );
}
