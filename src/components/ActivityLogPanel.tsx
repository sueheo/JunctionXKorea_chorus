import { useMemo, useState } from "react";
import type { VisualizationAgent, VisualizationLog } from "../types/visualization";

type ActivityLogPanelProps = {
  agents: VisualizationAgent[];
  isOpen: boolean;
  latestLogId?: string;
  logs: VisualizationLog[];
  onToggle: () => void;
};

type LogFilter = "all" | "working" | "completed" | "issue";

const filters: Array<{ id: LogFilter; label: string }> = [
  { id: "all", label: "전체" },
  { id: "working", label: "진행 중" },
  { id: "completed", label: "완료" },
  { id: "issue", label: "문제" },
];

const filterMatches = {
  all: () => true,
  working: (log: VisualizationLog) => log.status === "working" || log.icon === "music",
  completed: (log: VisualizationLog) => log.status === "completed" || log.icon === "check",
  issue: (log: VisualizationLog) => log.status === "error" || log.icon === "issue",
};

export function ActivityLogPanel({ agents, isOpen, latestLogId, logs, onToggle }: ActivityLogPanelProps) {
  const [activeFilter, setActiveFilter] = useState<LogFilter>("all");
  const agentById = useMemo(() => Object.fromEntries(agents.map((agent) => [agent.id, agent])), [agents]);
  const filteredLogs = logs.filter(filterMatches[activeFilter]);

  return (
    <aside className="activity-panel" aria-label="활동 로그" aria-hidden={!isOpen}>
      <div className="activity-panel-header">
        <h2>활동 로그</h2>
        <button
          className="activity-panel-toggle"
          onClick={onToggle}
          type="button"
          aria-expanded={isOpen}
          aria-label={isOpen ? "활동 로그 닫기" : "활동 로그 열기"}
        >
          <span />
          <span />
        </button>
      </div>
      <div className="activity-filter-row" aria-label="로그 필터">
        {filters.map((filter) => (
          <button
            className={filter.id === activeFilter ? "active" : ""}
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            type="button"
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div className="activity-log-list">
        {filteredLogs.map((log) => (
          <button className={`activity-log-item ${log.id === latestLogId ? "is-latest" : ""}`} key={log.id} type="button">
            <span
              className={`activity-status-dot ${resolveLogTone(log, agentById[log.agentId])}`}
              aria-hidden="true"
            />
            <span className="activity-log-copy">
              <strong>{log.agentName}</strong>
              <span>{log.message}</span>
            </span>
            <time>{formatLogTime(log.timeGroup, log.status)}</time>
          </button>
        ))}
        {filteredLogs.length === 0 ? <p className="activity-empty">표시할 로그가 없어요</p> : null}
      </div>
      <p className="activity-panel-hint">로그를 선택하면 상세 근거를 볼 수 있어요</p>
    </aside>
  );
}

function resolveLogTone(log: VisualizationLog, agent?: VisualizationAgent) {
  if (log.icon === "issue" || log.status === "error") {
    return "issue";
  }

  if (log.icon === "check" || log.status === "completed") {
    return "completed";
  }

  if (agent?.status === "idle") {
    return "idle";
  }

  return "working";
}

function formatLogTime(timeGroup: string, status: VisualizationLog["status"]) {
  if (status === "idle") {
    return "대기";
  }

  if (timeGroup === "지금 막") {
    return "지금";
  }

  return timeGroup.replace(" 전", "");
}
