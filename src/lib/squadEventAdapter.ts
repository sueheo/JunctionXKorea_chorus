import type {
  MockReplay,
  MockReplayEvent,
  VisualizationAgent,
  VisualizationLog,
  VisualizationState,
  VisualizationStep,
} from "../types/visualization";

type ReplayOptions = {
  elapsedSeconds: number;
  isPaused: boolean;
  isStopped: boolean;
};

const stepOrder = ["find", "fix", "verify"];

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

  if (isStopped) {
    statusLabel = "Stopped";
    statusTone = "stopped";
    issue.visible = true;
    issue.message = "Replay가 중지됐어요";
    stageMessage = "사용자가 replay를 멈췄어요";
  }

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
    agents: isStopped ? stopAgents(agents) : agents,
    logs: logs.reverse(),
    latestLogId,
    activeAgentId,
    stageMessage,
    steps: createSteps(activeStepId),
    reason,
    summary: createResourceSummary(agents),
    issue,
  };
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
  });
}

function createSteps(activeStepId: string): VisualizationStep[] {
  return [
    { id: "find", label: "문제 찾기", state: resolveStepState("find", activeStepId) },
    { id: "fix", label: "수정하기", state: resolveStepState("fix", activeStepId) },
    { id: "verify", label: "확인하기", state: resolveStepState("verify", activeStepId) },
  ];
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
  const totalTokens = agents.reduce((sum, agent) => sum + agent.tokenUsed, 0);

  return {
    totalTokens,
    tokenLimit: 20000,
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
