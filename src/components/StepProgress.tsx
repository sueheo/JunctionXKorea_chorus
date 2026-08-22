import type { VisualizationStep } from "../types/visualization";

type StepProgressProps = {
  steps: VisualizationStep[];
};

export function StepProgress({ steps }: StepProgressProps) {
  return (
    <nav className="step-progress" aria-label="Squad progress">
      {steps.map((step, index) => (
        <span className={`step-group ${step.state}`} key={step.id}>
          <span className="step-pill">
            <span />
            {step.label}
          </span>
          {index < steps.length - 1 ? <i aria-hidden="true" /> : null}
        </span>
      ))}
    </nav>
  );
}
