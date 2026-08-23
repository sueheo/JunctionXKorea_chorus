import type { ReplayScenario, ReplayScenarioId } from "../data/replayScenarios";
import type { RunSummary } from "../types/visualization";

type TopRunBarProps = {
  onPrimaryControl: () => void;
  onScenarioChange: (scenarioId: ReplayScenarioId) => void;
  onStop: () => void;
  run: RunSummary;
  scenarioId: ReplayScenarioId;
  scenarios: ReplayScenario[];
};

export function TopRunBar({ onPrimaryControl, onScenarioChange, onStop, run, scenarioId, scenarios }: TopRunBarProps) {
  const shouldShowPlay = run.isPaused || run.isStopped || run.statusTone === "complete";
  const primaryLabel = shouldShowPlay ? (run.isStopped || run.statusTone === "complete" ? "Replay 다시 재생" : "Replay 재개") : "Replay 일시정지";

  return (
    <header className="top-run-bar">
      <div className="brand-mark" aria-label="RareSuSi logo">
        <span className="brand-icon">
          <span />
        </span>
        <strong>RareSuSi</strong>
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
      <div className={`run-status ${run.statusTone}`}>
        <span className="status-dot" />
        <strong>{run.statusLabel}</strong>
      </div>
      <div className="step-counter">
        <strong>
          {run.currentStep}/{run.totalSteps}
        </strong>
        <span className="progress-track">
          <span style={{ width: `${(run.currentStep / run.totalSteps) * 100}%` }} />
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
        <span aria-hidden="true" />
      </button>
      <button
        className="control-button danger"
        disabled={run.isStopped || run.statusTone === "complete"}
        onClick={onStop}
        type="button"
        aria-label="Replay 중지"
        title="Stop"
      >
        <span aria-hidden="true" />
      </button>
    </header>
  );
}
