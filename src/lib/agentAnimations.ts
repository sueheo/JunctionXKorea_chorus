import type { AgentRole, AgentStatus } from "../types/visualization";
import coderCompleted from "../assets/agent-animations/coder/completed.webm";
import coderDefault from "../assets/agent-animations/coder/default.webm";
import coderError from "../assets/agent-animations/coder/error.webm";
import coderIdle from "../assets/agent-animations/coder/idle.webm";
import coderWorking from "../assets/agent-animations/coder/working.webm";
import criteriaCompleted from "../assets/agent-animations/criteria/completed.webm";
import criteriaError from "../assets/agent-animations/criteria/error.webm";
import criteriaIdle from "../assets/agent-animations/criteria/idle.webm";
import criteriaReady from "../assets/agent-animations/criteria/ready.webm";
import criteriaWorking from "../assets/agent-animations/criteria/working.webm";
import judgeCompleted from "../assets/agent-animations/judge/completed.webm";
import judgeDefault from "../assets/agent-animations/judge/default.webm";
import judgeError from "../assets/agent-animations/judge/error.webm";
import judgeIdle from "../assets/agent-animations/judge/idle.webm";
import judgeWorking from "../assets/agent-animations/judge/working.webm";
import orchestratorDefault from "../assets/agent-animations/orchestrator/default.webm";
import orchestratorError from "../assets/agent-animations/orchestrator/error.webm";
import orchestratorIdle from "../assets/agent-animations/orchestrator/idle.webm";
import orchestratorWorking from "../assets/agent-animations/orchestrator/working.webm";
import reviewerCompleted from "../assets/agent-animations/reviewer/completed.webm";
import reviewerDefault from "../assets/agent-animations/reviewer/default.webm";
import reviewerError from "../assets/agent-animations/reviewer/error.webm";
import reviewerIdle from "../assets/agent-animations/reviewer/idle.webm";
import reviewerWorking from "../assets/agent-animations/reviewer/working.webm";

type AnimationMap = Partial<Record<AgentRole, Partial<Record<AgentStatus | "default", string>>>>;

const agentAnimations: AnimationMap = {
  coder: {
    completed: coderCompleted,
    default: coderDefault,
    error: coderError,
    idle: coderIdle,
    ready: coderIdle,
    working: coderWorking,
  },
  criteria: {
    completed: criteriaCompleted,
    default: criteriaIdle,
    error: criteriaError,
    idle: criteriaIdle,
    ready: criteriaReady,
    working: criteriaWorking,
  },
  judge: {
    completed: judgeCompleted,
    default: judgeDefault,
    error: judgeError,
    idle: judgeIdle,
    ready: judgeIdle,
    working: judgeWorking,
  },
  orchestrator: {
    completed: orchestratorDefault,
    default: orchestratorDefault,
    error: orchestratorError,
    idle: orchestratorIdle,
    ready: orchestratorIdle,
    working: orchestratorWorking,
  },
  reviewer: {
    completed: reviewerCompleted,
    default: reviewerDefault,
    error: reviewerError,
    idle: reviewerIdle,
    ready: reviewerIdle,
    working: reviewerWorking,
  },
};

export function getAgentAnimationSrc(role: AgentRole, status: AgentStatus) {
  const roleAnimations = agentAnimations[role];

  return roleAnimations?.[status] ?? roleAnimations?.default;
}
