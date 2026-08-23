import type { RunSummary } from "../types/visualization";

type TopRunBarProps = {
  onStop: () => void;
  onTogglePause: () => void;
  run: RunSummary;
};

export function TopRunBar({ onStop, onTogglePause, run }: TopRunBarProps) {
  return (
    <header className="top-run-bar">
      <div className="brand-mark" aria-label="RareSuSi logo">
        <span className="brand-icon">
          <span />
        </span>
        <strong>RareSuSi</strong>
      </div>
      <button className="project-picker" type="button">
        <span className="project-icon" aria-hidden="true">문제</span>
        <strong>{run.projectName}</strong>
        <b aria-hidden="true">⌄</b>
      </button>
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
        className="control-button pause"
        disabled={run.isStopped}
        onClick={onTogglePause}
        type="button"
        aria-label={run.isPaused ? "Replay 재개" : "Replay 일시정지"}
        title={run.isPaused ? "Resume" : "Pause"}
      >
        <span aria-hidden="true" />
      </button>
      <button
        className="control-button danger"
        disabled={run.isStopped}
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
