import type { VisualizationStep } from "../types/visualization";

type StepProgressProps = {
  steps: VisualizationStep[];
};

export function StepProgress({ steps }: StepProgressProps) {
  return (
    <nav className="step-progress" aria-label="Squad progress">
      {steps.map((step) => (
        <span className={`step-pill ${step.state}`} key={step.id}>
          <span />
          {step.label}
        </span>
      ))}
    </nav>
  );
}
