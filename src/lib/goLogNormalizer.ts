import type {
  GoHistory,
  GoHistoryExecution,
  GoHistoryTask,
  GoRawEvent,
  GoRawEventPayload,
} from "../types/goLog";
import type {
  AgentStatus,
  MockReplay,
  NormalizedReplayEvent,
  VisualizationAgent,
  VisualizationLog,
} from "../types/visualization";

type NormalizeOptions = {
  baseAgents: VisualizationAgent[];
  executionId: string;
  timeScale?: number;
};

type ExecutionSlice = {
  events: GoRawEvent[];
  history?: GoHistoryExecution;
};

const fallbackExecutionTitle = "GO sample replay";
const statusLabels: Record<AgentStatus, string> = {
  idle: "대기",
  ready: "준비",
  working: "진행 중",
  completed: "완료",
  error: "문제",
};

export function parseGoJsonl(rawJsonl: string): GoRawEvent[] {
  return rawJsonl
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as GoRawEvent);
}

export function createGoReplay(
  rawEvents: GoRawEvent[],
  history: GoHistory,
  options: NormalizeOptions,
): MockReplay {
  const execution = selectExecution(rawEvents, history, options.executionId);
  const events = normalizeGoEvents(execution.events, history, options);
  const durationSeconds = Math.max(...events.map((event) => event.at), 0) + 2;

  return {
    projectName: execution.history?.request ?? fallbackExecutionTitle,
    totalSteps: 3,
    durationSeconds,
    baseAgents: options.baseAgents.map((agent) => ({
      ...agent,
      status: agent.id === "orchestrator" ? "ready" : "idle",
      statusLabel: agent.id === "orchestrator" ? "준비" : "대기",
      currentTask:
        agent.id === "orchestrator"
          ? "GO 로그를 replay로 바꿀 준비를 하고 있어요"
          : "GO 로그 이벤트를 기다리고 있어요",
      tokenUsed: 0,
    })),
    events,
  };
}

export function normalizeGoEvents(
  rawEvents: GoRawEvent[],
  history: GoHistory,
  { baseAgents, executionId, timeScale = 0.12 }: NormalizeOptions,
): NormalizedReplayEvent[] {
  const execution = history.find((item) => item.executionId === executionId);
  const taskById = new Map(execution?.tasks.map((task) => [task.taskId, task]));
  const rawAgentToUiAgent = createAgentMap(baseAgents, execution);
  const activeTaskByRawAgent = new Map<string, GoHistoryTask>();
  const tokenTotalByUiAgent = new Map<string, number>();
  const selectedEvents = selectExecution(rawEvents, history, executionId).events;
  const baseTimestamp = selectedEvents[0]?.timestamp;
  const normalized: NormalizedReplayEvent[] = [];

  selectedEvents.forEach((event, eventIndex) => {
    const at = toReplaySecond(event.timestamp, baseTimestamp, timeScale);

    switch (event.eventType) {
      case "squad:planning-started":
        normalized.push(createEvent(event, eventIndex, at, "run_started", {
          message: "GO 요청을 살펴보기 시작했어요",
        }));
        normalized.push(createLog(event, eventIndex, at, "orchestrator", "진행 관리자가 요청을 읽고 있어요"));
        break;

      case "squad:plan-ready":
        normalized.push(createEvent(event, eventIndex, at, "step_changed", { stepId: "find" }));
        normalized.push(
          createLog(
            event,
            eventIndex,
            at,
            "orchestrator",
            `작업 계획이 준비됐어요 (${event.payload.taskCount ?? 0}개 task)`,
          ),
        );
        if (event.payload.plannerWarning) {
          normalized.push(
            createEvent(event, eventIndex, at, "issue_found", {
              agentId: "orchestrator",
              icon: "issue",
              message: "계획 단계에서 경고가 감지됐어요",
              reason: {
                title: "왜 진행 관리자가 멈췄나요?",
                body: summarizeError(event.payload.plannerWarning),
              },
            }),
          );
        }
        break;

      case "squad:execution-started":
        normalized.push(
          createLog(event, eventIndex, at, "orchestrator", "팀이 GO 실행 로그를 따라 작업을 시작했어요"),
        );
        break;

      case "squad:task-wave-started":
        normalized.push(
          createEvent(event, eventIndex, at, "step_changed", {
            stepId: event.payload.waveIndex === 0 ? "fix" : "verify",
          }),
        );
        normalized.push(
          createLog(
            event,
            eventIndex,
            at,
            "orchestrator",
            `${(event.payload.waveIndex ?? 0) + 1}번째 작업 묶음이 시작됐어요`,
          ),
        );
        break;

      case "squad:task-status-changed": {
        const task = getTask(event.payload, taskById);
        const agentId = resolveUiAgentId(task?.agentId, rawAgentToUiAgent, task?.agentName);
        const status = mapTaskStatus(event.payload.newStatus);
        const rawTraceMessage =
          event.payload.newStatus === "in_progress" || event.payload.newStatus === "running"
            ? `Task '${task?.title ?? event.payload.taskId ?? "Untitled task"}' assigned to agent '${task?.agentName ?? "agent"}'`
            : `Task '${task?.title ?? event.payload.taskId ?? "Untitled task"}' status changed to '${event.payload.newStatus ?? "unknown"}'`;

        if (task?.agentId && status === "working") {
          activeTaskByRawAgent.set(task.agentId, task);
        }

        normalized.push(
          createEvent(event, eventIndex, at, "agent_status_changed", {
            agentId,
            status,
            statusLabel: statusLabels[status],
            currentTask: task ? `${task.agentName}가 ${task.title} 작업을 진행하고 있어요` : "작업을 진행하고 있어요",
            rawTraceSource: task?.agentId,
            rawTraceMessage,
          }),
        );
        break;
      }

      case "squad:agent-state-changed": {
        const agentId = resolveUiAgentId(event.payload.agentId, rawAgentToUiAgent);
        const status = event.payload.state === "running" ? "working" : "idle";
        const activeTask = event.payload.agentId ? activeTaskByRawAgent.get(event.payload.agentId) : undefined;
        normalized.push(
          createEvent(event, eventIndex, at, "agent_status_changed", {
            agentId,
            status,
            statusLabel: statusLabels[status],
            currentTask:
              status === "working" && activeTask
                ? `${activeTask.agentName}가 ${activeTask.title} 작업을 처리하고 있어요`
                : "다음 GO 이벤트를 기다리고 있어요",
          }),
        );
        break;
      }

      case "squad:workspace-file-changed":
        normalized.push(
          createLog(
            event,
            eventIndex,
            at,
            "coder",
            `${event.payload.path ?? "파일"} 파일이 ${event.payload.changeType ?? "변경"}됐어요`,
          ),
        );
        break;

      case "squad:token-usage-update": {
        const agentId = resolveUiAgentId(event.payload.agentId, rawAgentToUiAgent);
        const previous = tokenTotalByUiAgent.get(agentId) ?? 0;
        const nextTotal = Math.max(previous, event.payload.total ?? 0);
        tokenTotalByUiAgent.set(agentId, nextTotal);
        normalized.push(
          createEvent(event, eventIndex, at, "tokens_changed", {
            agentId,
            tokenUsed: nextTotal,
          }),
        );
        break;
      }

      case "squad:task-completed": {
        const task = getTask(event.payload, taskById);
        const agentId = resolveUiAgentId(task?.agentId, rawAgentToUiAgent, task?.agentName);
        const status = event.payload.success ? "completed" : "error";
        const rawTraceMessage = event.payload.success
          ? `Task '${event.payload.taskTitle ?? task?.title ?? "Untitled task"}' completed by '${task?.agentName ?? "agent"}'`
          : `Task '${event.payload.taskTitle ?? task?.title ?? "Untitled task"}' failed: ${summarizeError(event.payload.error)}`;
        normalized.push(
          createEvent(event, eventIndex, at, "agent_status_changed", {
            agentId,
            status,
            statusLabel: statusLabels[status],
            currentTask: event.payload.success
              ? `${event.payload.taskTitle ?? task?.title ?? "작업"} 완료`
              : "다시 확인이 필요한 작업이 있어요",
            rawTraceSource: task?.agentId,
            rawTraceMessage,
          }),
        );
        normalized.push(
          createEvent(event, eventIndex, at, event.payload.success ? "log_added" : "issue_found", {
            agentId,
            icon: event.payload.success ? "check" : "issue",
            rawTraceSource: task?.agentId,
            rawTraceMessage,
            message: event.payload.success
              ? `${task?.agentName ?? "에이전트"}가 작업을 완료했어요`
              : `${task?.agentName ?? "에이전트"} 작업에서 문제가 발생했어요`,
            reason: event.payload.success
              ? undefined
              : {
                  title: "왜 이 작업을 다시 봐야 하나요?",
                  body: summarizeError(event.payload.error),
                },
          }),
        );
        break;
      }

      case "squad:aggregation-started":
        normalized.push(createEvent(event, eventIndex, at, "step_changed", { stepId: "verify" }));
        normalized.push(createLog(event, eventIndex, at, "judge", "최종 판정자가 결과를 모아 확인하고 있어요"));
        normalized.push(
          createEvent(event, eventIndex, at, "agent_status_changed", {
            agentId: "judge",
            status: "working",
            statusLabel: "진행 중",
            currentTask: "완료된 GO task 결과를 종합하고 있어요",
          }),
        );
        break;

      case "squad:execution-completed":
        normalized.push(
          createEvent(event, eventIndex, at, "agent_status_changed", {
            agentId: "judge",
            status: "completed",
            statusLabel: "완료",
            currentTask: "최종 결과 확인이 끝났어요",
          }),
        );
        normalized.push(
          createEvent(event, eventIndex, at, "run_completed", {
            message: "GO sample replay가 끝났어요",
          }),
        );
        break;
    }
  });

  return normalized.sort((a, b) => a.at - b.at || a.id.localeCompare(b.id));
}

function selectExecution(rawEvents: GoRawEvent[], history: GoHistory, executionId: string): ExecutionSlice {
  const sortedEvents = [...rawEvents].sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
  const events: GoRawEvent[] = [];
  let isInsideExecution = false;

  for (const event of sortedEvents) {
    const eventExecutionId = event.payload.executionId;

    if (event.eventType === "squad:planning-started" && eventExecutionId === executionId) {
      isInsideExecution = true;
    }

    if (eventExecutionId === executionId || (isInsideExecution && !eventExecutionId)) {
      events.push(event);
    }

    if (event.eventType === "squad:execution-completed" && eventExecutionId === executionId) {
      isInsideExecution = false;
    }
  }

  return {
    events,
    history: history.find((item) => item.executionId === executionId),
  };
}

function createAgentMap(baseAgents: VisualizationAgent[], execution?: GoHistoryExecution) {
  const rawAgentToUiAgent = new Map<string, string>();

  for (const task of execution?.tasks ?? []) {
    rawAgentToUiAgent.set(task.agentId, mapAgentNameToUiAgentId(task.agentName, baseAgents));
  }

  return rawAgentToUiAgent;
}

function mapAgentNameToUiAgentId(agentName: string, baseAgents: VisualizationAgent[]) {
  const normalizedName = agentName.toLowerCase();
  const roleId =
    normalizedName.includes("리뷰") || normalizedName.includes("검사") || normalizedName.includes("review")
      ? "reviewer"
      : normalizedName.includes("기준") || normalizedName.includes("요구사항") || normalizedName.includes("명세")
        ? "criteria"
        : normalizedName.includes("최종") || normalizedName.includes("판정") || normalizedName.includes("judge")
          ? "judge"
          : normalizedName.includes("기획") || normalizedName.includes("계획") || normalizedName.includes("관리")
            ? "orchestrator"
            : "coder";

  return baseAgents.length === 0 || baseAgents.some((agent) => agent.id === roleId) ? roleId : "orchestrator";
}

function resolveUiAgentId(rawAgentId: string | undefined, agentMap: Map<string, string>, fallbackName?: string) {
  if (rawAgentId && agentMap.has(rawAgentId)) {
    return agentMap.get(rawAgentId) ?? "orchestrator";
  }

  if (fallbackName) {
    return mapAgentNameToUiAgentId(fallbackName, []);
  }

  return "orchestrator";
}

function getTask(payload: GoRawEventPayload, taskById: Map<string, GoHistoryTask>) {
  return payload.taskId ? taskById.get(payload.taskId) : undefined;
}

function mapTaskStatus(status: string | undefined): AgentStatus {
  switch (status) {
    case "in_progress":
    case "running":
      return "working";
    case "completed":
      return "completed";
    case "failed":
    case "cancelled":
      return "error";
    default:
      return "idle";
  }
}

function toReplaySecond(timestamp: string, baseTimestamp: string | undefined, timeScale: number) {
  if (!baseTimestamp) {
    return 0;
  }

  const elapsedMs = Date.parse(timestamp) - Date.parse(baseTimestamp);
  return Math.max(0, Math.round((elapsedMs / 1000) * timeScale));
}

function createEvent(
  rawEvent: GoRawEvent,
  eventIndex: number,
  at: number,
  type: NormalizedReplayEvent["type"],
  patch: Partial<NormalizedReplayEvent>,
): NormalizedReplayEvent {
  const rawTraceLevel = patch.rawTraceLevel ?? resolveRawTraceLevel(rawEvent);
  const rawTraceSource = patch.rawTraceSource ?? rawEvent.payload.agentId ?? "system";
  const rawTraceMessage = patch.rawTraceMessage ?? summarizeRawTraceEvent(rawEvent);

  return {
    id: `go-${rawEvent.id}-${eventIndex}-${type}`,
    at,
    type,
    source: "go-events-jsonl",
    ...patch,
    isRawTrace: true,
    rawTraceLevel,
    rawTraceSource,
    rawTraceMessage,
    rawEventType: rawEvent.eventType,
    rawId: rawEvent.id,
  };
}

function createLog(
  rawEvent: GoRawEvent,
  eventIndex: number,
  at: number,
  agentId: string,
  message: string,
  icon: VisualizationLog["icon"] = "music",
) {
  return createEvent(rawEvent, eventIndex, at, "log_added", {
    agentId,
    message,
    icon,
  });
}

function resolveRawTraceLevel(rawEvent: GoRawEvent) {
  return rawEvent.payload.error || rawEvent.payload.success === false || rawEvent.payload.plannerWarning
    ? "ERROR"
    : "INFO";
}

function summarizeRawTraceEvent(rawEvent: GoRawEvent) {
  const payload = rawEvent.payload;

  switch (rawEvent.eventType) {
    case "squad:planning-started":
      return `Execution started: ${payload.request ?? "No request provided"}`;
    case "squad:plan-ready":
      return `Plan generated: ${payload.title ?? "Untitled plan"} with ${payload.taskCount ?? 0} task(s)`;
    case "squad:execution-started":
      return `Execution started with ${payload.totalTasks ?? 0} task(s) across ${payload.totalWaves ?? 0} wave(s)`;
    case "squad:task-wave-started":
      return `Starting wave ${(payload.waveIndex ?? 0) + 1}/${payload.totalWaves ?? "?"} with ${payload.taskIds?.length ?? 0} task(s)`;
    case "squad:agent-state-changed":
      return `Agent '${payload.agentId ?? "unknown"}' changed state to '${payload.state ?? "unknown"}'`;
    case "squad:workspace-file-changed":
      return `${payload.path ?? "Unknown file"} file ${payload.changeType ?? "changed"}`;
    case "squad:token-usage-update":
      return `Token usage updated: ${payload.total ?? 0} tokens`;
    case "squad:aggregation-started":
      return "Final aggregation started";
    case "squad:execution-completed":
      return payload.success === false
        ? `Execution failed: ${summarizeError(payload.error)}`
        : "Execution completed successfully";
    case "squad:execution-token-usage":
      return `Execution token usage: ${payload.tokenUsage?.total ?? payload.total ?? 0} tokens`;
    default:
      return `${rawEvent.eventType}: ${JSON.stringify(payload)}`;
  }
}

function summarizeError(error: string | null | undefined) {
  if (!error) {
    return "GO 실행 결과를 다시 확인해야 해요.";
  }

  if (error.includes("429")) {
    return "모델 호출 제한에 걸려 작업이 실패했어요. 잠시 뒤 다시 실행하면 회복될 가능성이 높아요.";
  }

  if (error.includes("404")) {
    return "요청한 모델을 사용할 수 없어 작업이 실패했어요. 모델 설정을 확인해야 해요.";
  }

  if (error.includes("500")) {
    return "모델 서버 오류로 작업이 실패했어요. 같은 작업을 다시 시도할 수 있어요.";
  }

  return error.slice(0, 140);
}
