import { useMemo, useState } from "react";
import type { RawTraceLog, RawTraceLevel, VisualizationAgent, VisualizationLog } from "../types/visualization";

type ActivityLogPanelProps = {
  agents: VisualizationAgent[];
  isOpen: boolean;
  latestLogId?: string;
  logs: VisualizationLog[];
  onToggle: () => void;
  rawTraceLogs: RawTraceLog[];
};

type LogFilter = "all" | "error" | "rawTrace";
type RawLevelFilter = "all" | RawTraceLevel;

const filters: Array<{ id: LogFilter; label: string }> = [
  { id: "all", label: "전체" },
  { id: "error", label: "에러" },
  { id: "rawTrace", label: "Raw Trace" },
];

const filterMatches = {
  all: () => true,
  error: (log: VisualizationLog) => log.status === "error" || log.icon === "issue",
  rawTrace: (log: VisualizationLog) => log.isRawTrace,
};

export function ActivityLogPanel({ agents, isOpen, latestLogId, logs, onToggle, rawTraceLogs }: ActivityLogPanelProps) {
  const [activeFilter, setActiveFilter] = useState<LogFilter>("all");
  const [rawLevelFilter, setRawLevelFilter] = useState<RawLevelFilter>("all");
  const agentById = useMemo(() => Object.fromEntries(agents.map((agent) => [agent.id, agent])), [agents]);
  const filteredLogs = logs.filter(filterMatches[activeFilter]);
  const filteredRawTraceLogs = rawTraceLogs.filter((log) => rawLevelFilter === "all" || log.level === rawLevelFilter);

  return (
    <aside
      className={`activity-panel ${activeFilter === "rawTrace" ? "raw-trace-mode" : ""}`}
      aria-label="활동 로그"
      aria-hidden={!isOpen}
    >
      <div className="activity-panel-header">
        <h2>{activeFilter === "rawTrace" ? "실행 상세" : "활동 로그"}</h2>
        <button
          className="activity-panel-toggle"
          onClick={onToggle}
          type="button"
          aria-expanded={isOpen}
          aria-label={isOpen ? "활동 로그 닫기" : "활동 로그 열기"}
        >
          <span className="drawer-toggle-icon" />
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
      {activeFilter === "rawTrace" ? (
        <RawTraceList logs={filteredRawTraceLogs} onLevelChange={setRawLevelFilter} selectedLevel={rawLevelFilter} />
      ) : (
        <div className="activity-log-list">
          {filteredLogs.map((log) => (
            <button
              className={`activity-log-item ${log.id === latestLogId ? "is-latest" : ""}`}
              key={log.id}
              type="button"
            >
              <span
                className={`activity-status-dot ${resolveLogTone(log, agentById[log.agentId])}`}
                style={{ backgroundColor: resolveLogColor(log, agentById[log.agentId]) }}
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
      )}
    </aside>
  );
}

type RawTraceListProps = {
  logs: RawTraceLog[];
  onLevelChange: (level: RawLevelFilter) => void;
  selectedLevel: RawLevelFilter;
};

function RawTraceList({ logs, onLevelChange, selectedLevel }: RawTraceListProps) {
  return (
    <section className="raw-trace-view" aria-label="Raw Trace">
      <div className="raw-trace-toolbar">
        <label>
          <span>레벨</span>
          <select
            aria-label="Raw Trace 레벨 필터"
            onChange={(event) => onLevelChange(event.target.value as RawLevelFilter)}
            value={selectedLevel}
          >
            <option value="all">모든 레벨</option>
            <option value="INFO">INFO</option>
            <option value="ERROR">ERROR</option>
          </select>
        </label>
        <strong>{logs.length}개 항목</strong>
      </div>
      <div className="raw-trace-list">
        {logs.map((log) => (
          <article className="raw-trace-row" key={log.id}>
            <span className={`raw-trace-level ${log.level.toLowerCase()}`}>{log.level}</span>
            <span className="raw-trace-source">{log.source}</span>
            <code>{log.message}</code>
          </article>
        ))}
        {logs.length === 0 ? <p className="activity-empty">표시할 Raw Trace가 없어요</p> : null}
      </div>
    </section>
  );
}

function resolveLogColor(log: VisualizationLog, agent?: VisualizationAgent) {
  if (log.icon === "issue" || log.status === "error") {
    return "#ef4444";
  }

  if (agent?.accentColor) {
    return agent.accentColor;
  }

  if (log.icon === "check" || log.status === "completed") {
    return "#27ae60";
  }

  return "#2ea3f2";
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
