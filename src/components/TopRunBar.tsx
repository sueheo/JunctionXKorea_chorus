import type { ReplayScenario, ReplayScenarioId } from "../data/replayScenarios";
import chorusLogo from "../assets/chorus-logo.png";
import { formatTokenCount } from "../lib/tokenModels";
import type { ResourceSummary, RunSummary } from "../types/visualization";

type TopRunBarProps = {
  onPrimaryControl: () => void;
  onScenarioChange: (scenarioId: ReplayScenarioId) => void;
  onStop: () => void;
  run: RunSummary;
  scenarioId: ReplayScenarioId;
  scenarios: ReplayScenario[];
  summary: ResourceSummary;
};

export function TopRunBar({
  onPrimaryControl,
  onScenarioChange,
  onStop,
  run,
  scenarioId,
  scenarios,
  summary,
}: TopRunBarProps) {
  const shouldShowPlay = run.isPaused || run.isStopped || run.statusTone === "complete";
  const primaryLabel = shouldShowPlay ? "Replay 실행" : "Replay 일시정지";
  const tokenPercent = Math.min(100, (summary.totalTokens / summary.tokenLimit) * 100);

  return (
    <header className="top-run-bar">
      <div className="brand-mark" aria-label="Chorus logo">
        <img alt="Chorus" src={chorusLogo} />
      </div>
      <label className="project-picker">
        <span className="project-icon" aria-hidden="true">문제</span>
        <span>
          <small>시나리오</small>
          <select
            aria-label="Replay 시나리오 선택"
            onChange={(event) => onScenarioChange(event.target.value as ReplayScenarioId)}
            value={scenarioId}
          >
            {scenarios.map((scenario) => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.label}
              </option>
            ))}
          </select>
        </span>
      </label>
      <div className="top-control-cluster">
        <div className="top-resource-summary" aria-label="전체 토큰과 예상 비용">
          <div>
            <strong>
              토큰 {formatTokenCount(summary.totalTokens)} / {formatTokenCount(summary.tokenLimit)}
            </strong>
            <span>₩{summary.estimatedCostKrw.toLocaleString("ko-KR")}</span>
          </div>
          <span className="progress-track">
            <span style={{ width: `${tokenPercent}%` }} />
          </span>
        </div>
        <div className="elapsed-time">
          <span>Time</span>
          <strong>{run.elapsed}</strong>
        </div>
        <button
          className={`control-button ${shouldShowPlay ? "play" : "pause"}`}
          onClick={onPrimaryControl}
          type="button"
          aria-label={primaryLabel}
          title={primaryLabel}
        >
          <span className="control-icon" aria-hidden="true" />
          <span className="control-label">{shouldShowPlay ? "실행" : "일시정지"}</span>
        </button>
        <button
          className="control-button danger"
          disabled={run.isStopped || run.statusTone === "complete"}
          onClick={onStop}
          type="button"
          aria-label="Replay 중지"
          title="Replay 중지"
        >
          <span className="control-icon" aria-hidden="true" />
          <span className="control-label">정지</span>
        </button>
      </div>
    </header>
  );
}
