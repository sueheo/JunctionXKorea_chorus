import type { VisualizationLog } from "../types/visualization";

type ActivityLogPanelProps = {
  logs: VisualizationLog[];
};

export function ActivityLogPanel({ logs }: ActivityLogPanelProps) {
  const groups = logs.reduce<Record<string, VisualizationLog[]>>((acc, log) => {
    acc[log.timeGroup] = [...(acc[log.timeGroup] ?? []), log];
    return acc;
  }, {});

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
            <h3>{timeGroup}</h3>
            {groupLogs.map((log) => (
              <article className="log-item" key={log.id}>
                <span className={`agent-avatar ${log.agentId}`} />
                <div>
                  <strong>{log.agentName}</strong>
                  <p>{log.message}</p>
                </div>
                <span className={`status-token ${log.status}`} />
              </article>
            ))}
          </section>
        ))}
      </div>
    </aside>
  );
}
