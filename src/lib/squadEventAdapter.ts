import type {
  MockReplay,
  MockReplayEvent,
  HandoffTrailNode,
  RawTraceLog,
  VisualizationAgent,
  VisualizationLog,
  VisualizationState,
  VisualizationStep,
} from "../types/visualization";
import { getAgentTokenUsage } from "./tokenModels";

type ReplayOptions = {
  elapsedSeconds: number;
  isPaused: boolean;
  isStopped: boolean;
};

const stepOrder = ["find", "fix", "verify"];
const maxHandoffTrailNodes = 5;
const handoffSlots: HandoffTrailNode["slot"][] = ["edge-left", "near-left", "center", "near-right", "edge-right"];

export function createVisualizationState(
  replay: MockReplay,
  { elapsedSeconds, isPaused, isStopped }: ReplayOptions,
): VisualizationState {
  const activeEvents = replay.events
    .filter((event) => event.at <= elapsedSeconds)
    .sort((a, b) => a.at - b.at);
  const agents = replay.baseAgents.map((agent) => ({ ...agent }));
  const logs: VisualizationLog[] = [];
  const reason = {
    title: "왜 이 에이전트가 깨어났나요?",
    body: "아직 Squad가 일을 시작하기 전이에요. 재생이 시작되면 각 에이전트가 왜 깨어나는지 이곳에서 설명해요.",
  };
  const issue = {
    visible: false,
    message: "",
  };
  let activeStepId = "find";
  let statusLabel = "Running normally";
  let statusTone: VisualizationState["run"]["statusTone"] = "normal";
  let activeAgentId: string | undefined;
  let latestLogId: string | undefined;
  let stageMessage = "팀이 문제를 살펴볼 준비를 하고 있어요";
  const isReplayFinished = elapsedSeconds >= replay.durationSeconds;

  for (const event of activeEvents) {
    switch (event.type) {
      case "run_started":
        statusLabel = "Running normally";
        statusTone = "normal";
        if (event.message) {
          stageMessage = event.message;
        }
        break;
      case "step_changed":
        if (event.stepId) {
          activeStepId = event.stepId;
        }
        break;
      case "agent_status_changed":
        updateAgent(agents, event);
        activeAgentId = event.agentId;
        if (event.currentTask) {
          stageMessage = event.currentTask;
        }
        break;
      case "tokens_changed":
        updateAgentTokens(agents, event);
        activeAgentId = event.agentId;
        break;
      case "log_added":
        appendLog(logs, agents, event, elapsedSeconds);
        latestLogId = event.id;
        activeAgentId = event.agentId;
        if (event.message) {
          stageMessage = event.message;
        }
        break;
      case "issue_found":
        statusLabel = "Needs attention";
        statusTone = "attention";
        issue.visible = true;
        issue.message = event.message ?? "검사에서 문제를 발견했어요";
        appendLog(logs, agents, event, elapsedSeconds);
        latestLogId = event.id;
        activeAgentId = event.agentId;
        stageMessage = issue.message;
        if (event.reason) {
          reason.title = event.reason.title;
          reason.body = event.reason.body;
        }
        break;
      case "reason_changed":
        if (event.reason) {
          reason.title = event.reason.title;
          reason.body = event.reason.body;
        }
        break;
      case "run_completed":
        statusLabel = "Replay complete";
        statusTone = "complete";
        if (event.message) {
          stageMessage = event.message;
        }
        break;
    }
  }

  if (isPaused) {
    statusLabel = "Paused";
    statusTone = "paused";
  }

  if (isReplayFinished && !isStopped) {
    if (issue.visible || statusTone === "attention") {
      statusLabel = "Replay failed";
      statusTone = "attention";
      stageMessage = issue.message || "Replay가 실패 상태로 종료됐어요";
    } else {
      statusLabel = "Replay complete";
      statusTone = "complete";
      stageMessage = "모든 에이전트가 작업을 완료했어요";
    }
  }

  if (isStopped) {
    statusLabel = "Stopped";
    statusTone = "stopped";
    issue.visible = true;
    issue.message = "Replay가 중지됐어요";
    stageMessage = "사용자가 replay를 멈췄어요";
  }

  const displayedAgents = resolveDisplayedAgents(agents, {
    isFailed: statusTone === "attention" && isReplayFinished && !isStopped,
    isComplete: statusTone === "complete" && isReplayFinished && !isStopped,
    isStopped,
  });

  return {
    run: {
      projectName: replay.projectName,
      statusLabel,
      statusTone,
      currentStep: Math.max(1, stepOrder.indexOf(activeStepId) + 1),
      totalSteps: replay.totalSteps,
      elapsed: formatElapsed(elapsedSeconds),
      isPaused,
      isStopped,
    },
    agents: displayedAgents,
    logs: logs.reverse(),
    rawTraceLogs: createRawTraceLogs(activeEvents),
    latestLogId,
    activeAgentId,
    stageMessage,
    steps: createSteps(activeStepId),
    handoffTrail: createHandoffTrail(displayedAgents, activeEvents, statusTone === "complete"),
    reason,
    summary: createResourceSummary(displayedAgents),
    issue,
  };
}

function resolveDisplayedAgents(
  agents: VisualizationAgent[],
  {
    isComplete,
    isFailed,
    isStopped,
  }: {
    isComplete: boolean;
    isFailed: boolean;
    isStopped: boolean;
  },
) {
  if (isStopped) {
    return stopAgents(agents);
  }

  if (isFailed) {
    return agents.map((agent) => ({
      ...agent,
      status: "error" as const,
      statusLabel: "실패",
      currentTask: "Replay 실패 결과를 확인했어요",
    }));
  }

  if (isComplete) {
    return agents.map((agent) => ({
      ...agent,
      status: "completed" as const,
      statusLabel: "완료",
      currentTask: "Replay 작업을 완료했어요",
    }));
  }

  return agents;
}

function createRawTraceLogs(events: MockReplayEvent[]): RawTraceLog[] {
  const seen = new Set<string>();
  const entries: RawTraceLog[] = [];

  for (const event of events) {
    if (!event.isRawTrace || !event.rawTraceMessage) {
      continue;
    }

    const id = `${event.rawEventType ?? event.type}-${event.rawId ?? event.id}-${event.rawTraceMessage}`;

    if (seen.has(id)) {
      continue;
    }

    seen.add(id);
    entries.push({
      id,
      level: event.rawTraceLevel ?? (event.status === "error" || event.icon === "issue" ? "ERROR" : "INFO"),
      source: event.rawTraceSource ?? event.agentId ?? "system",
      message: event.rawTraceMessage,
      rawEventType: event.rawEventType,
      rawId: event.rawId,
    });
  }

  return entries;
}

function updateAgent(agents: VisualizationAgent[], event: MockReplayEvent) {
  const agent = agents.find((item) => item.id === event.agentId);
  if (!agent) {
    return;
  }

  if (event.status) {
    agent.status = event.status;
  }

  if (event.statusLabel) {
    agent.statusLabel = event.statusLabel;
  }

  if (event.currentTask) {
    agent.currentTask = event.currentTask;
  }
}

function updateAgentTokens(agents: VisualizationAgent[], event: MockReplayEvent) {
  const agent = agents.find((item) => item.id === event.agentId);
  if (agent && typeof event.tokenUsed === "number") {
    agent.tokenUsed = event.tokenUsed;
  }
}

function appendLog(
  logs: VisualizationLog[],
  agents: VisualizationAgent[],
  event: MockReplayEvent,
  elapsedSeconds: number,
) {
  const agent = agents.find((item) => item.id === event.agentId);
  if (!agent || !event.message) {
    return;
  }

  logs.push({
    id: event.id,
    timeGroup: createTimeGroup(elapsedSeconds - event.at),
    agentId: agent.id,
    agentName: agent.name,
    message: event.message,
    status: event.status ?? agent.status,
    icon: event.icon ?? "music",
    isRawTrace: event.isRawTrace,
    rawEventType: event.rawEventType,
    rawId: event.rawId,
  });
}

function createSteps(activeStepId: string): VisualizationStep[] {
  return [
    { id: "find", label: "문제 찾기", state: resolveStepState("find", activeStepId) },
    { id: "fix", label: "수정하기", state: resolveStepState("fix", activeStepId) },
    { id: "verify", label: "확인하기", state: resolveStepState("verify", activeStepId) },
  ];
}

function createHandoffTrail(
  agents: VisualizationAgent[],
  events: MockReplayEvent[],
  isComplete: boolean,
): HandoffTrailNode[] {
  const agentIds = events
    .filter(isHandoffTrailEvent)
    .map((event) => event.agentId)
    .filter((agentId): agentId is string => Boolean(agentId) && agents.some((agent) => agent.id === agentId));
  const orderedAgentIds = collapseConsecutiveDuplicates(agentIds);
  const visibleAgentIds = orderedAgentIds.slice(-maxHandoffTrailNodes);

  if (visibleAgentIds.length === 0) {
    const firstAgent = agents.find((agent) => agent.id === "orchestrator") ?? agents[0];

    return firstAgent
      ? [
          {
            id: `${firstAgent.id}-initial`,
            agentId: firstAgent.id,
            label: firstAgent.name,
            slot: "center",
            state: "active",
          },
        ]
      : [];
  }

  const slots = getVisibleHandoffSlots(visibleAgentIds.length);

  return visibleAgentIds.map((agentId, index) => {
    const agent = agents.find((item) => item.id === agentId);
    const isLast = index === visibleAgentIds.length - 1;

    return {
      id: `${agentId}-${orderedAgentIds.length - visibleAgentIds.length + index}`,
      agentId,
      label: agent?.name ?? "에이전트",
      slot: slots[index],
      state: isComplete || !isLast ? "done" : "active",
    };
  });
}

function getVisibleHandoffSlots(count: number) {
  const startIndex = Math.max(0, Math.floor((handoffSlots.length - count) / 2));
  return handoffSlots.slice(startIndex, startIndex + count);
}

function isHandoffTrailEvent(event: MockReplayEvent) {
  return (
    Boolean(event.agentId) &&
    (event.type === "agent_status_changed" ||
      event.type === "log_added" ||
      event.type === "issue_found" ||
      event.type === "reason_changed" ||
      event.type === "run_completed")
  );
}

function collapseConsecutiveDuplicates(agentIds: string[]) {
  return agentIds.filter((agentId, index) => index === 0 || agentId !== agentIds[index - 1]);
}

function resolveStepState(stepId: string, activeStepId: string): VisualizationStep["state"] {
  const stepIndex = stepOrder.indexOf(stepId);
  const activeIndex = stepOrder.indexOf(activeStepId);

  if (stepIndex < activeIndex) {
    return "done";
  }

  if (stepIndex === activeIndex) {
    return "active";
  }

  return "upcoming";
}

function createResourceSummary(agents: VisualizationAgent[]) {
  const totalTokens = agents.reduce((sum, agent) => sum + getAgentTokenUsage(agent).weightedUsed, 0);
  const tokenLimit = agents.reduce((sum, agent) => sum + getAgentTokenUsage(agent).weightedLimit, 0);

  return {
    totalTokens,
    tokenLimit,
    estimatedCostKrw: Math.round(totalTokens * 0.05),
  };
}

function stopAgents(agents: VisualizationAgent[]) {
  return agents.map((agent) =>
    agent.status === "working"
      ? {
          ...agent,
          status: "idle" as const,
          statusLabel: "중지",
          currentTask: "사용자가 replay를 중지했어요",
        }
      : agent,
  );
}

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function createTimeGroup(secondsAgo: number) {
  if (secondsAgo <= 4) {
    return "지금 막";
  }

  if (secondsAgo <= 11) {
    return "1분 전";
  }

  return "2분 전";
}
