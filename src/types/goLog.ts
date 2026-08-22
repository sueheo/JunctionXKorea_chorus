export type GoSquadEventType =
  | "squad:planning-started"
  | "squad:plan-ready"
  | "squad:execution-started"
  | "squad:task-wave-started"
  | "squad:task-status-changed"
  | "squad:agent-state-changed"
  | "squad:task-completed"
  | "squad:aggregation-started"
  | "squad:execution-completed"
  | "squad:execution-token-usage"
  | "squad:workspace-file-changed"
  | "squad:token-usage-update";

export type GoTaskCounts = {
  cancelled: number;
  completed: number;
  failed: number;
  pending: number;
  running: number;
  skipped: number;
  total: number;
};

export type GoTokenUsage = {
  promptTokens: number;
  completionTokens: number;
  total?: number;
};

export type GoRawEventPayload = {
  agentId?: string;
  autoApprove?: boolean;
  changeType?: string;
  completionTokens?: number;
  error?: string | null;
  executionId?: string;
  newStatus?: string;
  oldStatus?: string;
  path?: string;
  planId?: string;
  plannerWarning?: string;
  promptTokens?: number;
  request?: string;
  result?: string;
  squadId?: string;
  state?: string;
  success?: boolean;
  taskCount?: number;
  taskCounts?: GoTaskCounts;
  taskId?: string;
  taskIds?: string[];
  taskTitle?: string;
  title?: string;
  total?: number;
  totalTasks?: number;
  totalWaves?: number;
  tokenUsage?: GoTokenUsage;
  waveIndex?: number;
  waves?: string[][];
};

export type GoRawEvent = {
  id: string | number;
  eventType: GoSquadEventType;
  squadId: string;
  payload: GoRawEventPayload;
  timestamp: string;
};

export type GoHistoryTask = {
  taskId: string;
  title: string;
  agentId: string;
  agentName: string;
  status: string;
  output?: string;
  error?: string | null;
  durationMs?: number;
  tokenUsage?: GoTokenUsage;
};

export type GoHistoryExecution = {
  executionId: string;
  squadId: string;
  squadName?: string;
  request: string;
  planTitle?: string;
  tasks: GoHistoryTask[];
  finalResult?: string;
  status?: string;
  totalTokenUsage?: GoTokenUsage;
  perAgentTokenUsage?: Record<string, GoTokenUsage>;
  durationMs?: number;
  artifacts?: unknown[];
  startedAt?: string;
  completedAt?: string;
};

export type GoHistory = GoHistoryExecution[];
