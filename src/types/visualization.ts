export type AgentStatus = "idle" | "ready" | "working" | "completed" | "error";

export type AgentRole =
  | "orchestrator"
  | "criteria"
  | "coder"
  | "reviewer"
  | "judge"
  | "conductor";

export type VisualizationAgent = {
  id: string;
  name: string;
  role: AgentRole;
  description: string;
  status: AgentStatus;
  statusLabel: string;
  currentTask: string;
  tokenUsed: number;
  tokenLimit: number;
  color: string;
  accentColor: string;
};

export type VisualizationLog = {
  id: string;
  timeGroup: string;
  agentId: string;
  agentName: string;
  message: string;
  status: AgentStatus;
  icon: "music" | "sleep" | "check" | "issue";
};

export type VisualizationStep = {
  id: string;
  label: string;
  state: "done" | "active" | "upcoming";
};

export type RunSummary = {
  projectName: string;
  statusLabel: string;
  currentStep: number;
  totalSteps: number;
  elapsed: string;
};

export type ResourceSummary = {
  totalTokens: number;
  tokenLimit: number;
  estimatedCostKrw: number;
};

export type MockReplay = {
  run: RunSummary;
  agents: VisualizationAgent[];
  logs: VisualizationLog[];
  steps: VisualizationStep[];
  reason: {
    title: string;
    body: string;
  };
  summary: ResourceSummary;
};

export type VisualizationState = MockReplay;
