export type AgentStatus = "idle" | "ready" | "working" | "completed" | "error";

export type AgentRole =
  | "orchestrator"
  | "criteria"
  | "coder"
  | "reviewer"
  | "judge"
  | "conductor";

export type TokenModelName = "Qwen" | "GPT" | "EXAONE";

export type VisualizationAgent = {
  id: string;
  name: string;
  role: AgentRole;
  modelName: TokenModelName;
  description: string;
  status: AgentStatus;
  statusLabel: string;
  currentTask: string;
  tokenUsed: number;
  tokenLimit: number;
  color: string;
  accentColor: string;
  assetSrc?: string;
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

export type HandoffTrailNode = {
  id: string;
  agentId: string;
  label: string;
  state: "done" | "active" | "upcoming";
};

export type RunSummary = {
  projectName: string;
  statusLabel: string;
  statusTone: "normal" | "attention" | "paused" | "stopped" | "complete";
  currentStep: number;
  totalSteps: number;
  elapsed: string;
  isPaused: boolean;
  isStopped: boolean;
};

export type ResourceSummary = {
  totalTokens: number;
  tokenLimit: number;
  estimatedCostKrw: number;
};

export type MockReplay = {
  projectName: string;
  totalSteps: number;
  durationSeconds: number;
  baseAgents: VisualizationAgent[];
  events: MockReplayEvent[];
};

export type MockReplayEvent = {
  id: string;
  at: number;
  type:
    | "run_started"
    | "step_changed"
    | "agent_status_changed"
    | "log_added"
    | "tokens_changed"
    | "reason_changed"
    | "issue_found"
    | "run_completed";
  agentId?: string;
  status?: AgentStatus;
  statusLabel?: string;
  currentTask?: string;
  stepId?: string;
  message?: string;
  icon?: VisualizationLog["icon"];
  tokenUsed?: number;
  reason?: {
    title: string;
    body: string;
  };
};

export type NormalizedReplayEvent = MockReplayEvent & {
  source: "go-events-jsonl" | "go-history" | "go-log-jsonl";
  rawEventType?: string;
  rawId?: string | number;
};

export type VisualizationState = {
  run: RunSummary;
  agents: VisualizationAgent[];
  logs: VisualizationLog[];
  latestLogId?: string;
  activeAgentId?: string;
  stageMessage: string;
  steps: VisualizationStep[];
  handoffTrail: HandoffTrailNode[];
  reason: {
    title: string;
    body: string;
  };
  summary: ResourceSummary;
  issue: {
    visible: boolean;
    message: string;
  };
};
