import type { RunSummary } from "../types/visualization";

type TopRunBarProps = {
  run: RunSummary;
};

export function TopRunBar({ run }: TopRunBarProps) {
  return (
    <header className="top-run-bar">
      <div className="brand-mark" aria-label="RareSuSi logo">
        <span className="brand-icon">R</span>
        <strong>RareSuSi</strong>
      </div>
      <button className="project-picker" type="button">
        <span>프로젝트</span>
        <strong>{run.projectName}</strong>
      </button>
      <div className="run-status">
        <span className="status-dot" />
        <strong>{run.statusLabel}</strong>
      </div>
      <div className="step-counter">
        <strong>
          {run.currentStep} of {run.totalSteps} steps
        </strong>
        <span className="progress-track">
          <span style={{ width: `${(run.currentStep / run.totalSteps) * 100}%` }} />
        </span>
      </div>
      <div className="elapsed-time">
        <span>경과 시간</span>
        <strong>{run.elapsed}</strong>
      </div>
      <button className="control-button" type="button">Pause</button>
      <button className="control-button danger" type="button">Stop</button>
    </header>
  );
}
