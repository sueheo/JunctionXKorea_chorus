import type { AgentRole, AgentStatus } from "../types/visualization";

export type AgentAnimationSources = {
  mov?: string;
  webm?: string;
};

type AnimationState = AgentStatus | "default";
type AnimationMap = Partial<Record<AgentRole, Partial<Record<AnimationState, AgentAnimationSources>>>>;

const animationUrls = import.meta.glob("../assets/agent-animations/**/*.{mov,webm}", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

function animationSources(role: AgentRole, state: AnimationState): AgentAnimationSources {
  const assetPath = `../assets/agent-animations/${role}/${state}`;

  return {
    mov: animationUrls[`${assetPath}.mov`],
    webm: animationUrls[`${assetPath}.webm`],
  };
}

const agentAnimations: AnimationMap = {
  coder: {
    completed: animationSources("coder", "completed"),
    default: animationSources("coder", "default"),
    error: animationSources("coder", "error"),
    idle: animationSources("coder", "idle"),
    ready: animationSources("coder", "idle"),
    working: animationSources("coder", "working"),
  },
  criteria: {
    completed: animationSources("criteria", "completed"),
    default: animationSources("criteria", "default"),
    error: animationSources("criteria", "error"),
    idle: animationSources("criteria", "idle"),
    ready: animationSources("criteria", "ready"),
    working: animationSources("criteria", "working"),
  },
  judge: {
    completed: animationSources("judge", "completed"),
    default: animationSources("judge", "default"),
    error: animationSources("judge", "error"),
    idle: animationSources("judge", "idle"),
    ready: animationSources("judge", "idle"),
    working: animationSources("judge", "working"),
  },
  orchestrator: {
    completed: animationSources("orchestrator", "default"),
    default: animationSources("orchestrator", "default"),
    error: animationSources("orchestrator", "error"),
    idle: animationSources("orchestrator", "idle"),
    ready: animationSources("orchestrator", "idle"),
    working: animationSources("orchestrator", "working"),
  },
  reviewer: {
    completed: animationSources("reviewer", "completed"),
    default: animationSources("reviewer", "default"),
    error: animationSources("reviewer", "error"),
    idle: animationSources("reviewer", "idle"),
    ready: animationSources("reviewer", "idle"),
    working: animationSources("reviewer", "working"),
  },
};

export function getAgentAnimationSources(role: AgentRole, status: AgentStatus) {
  const roleAnimations = agentAnimations[role];

  return roleAnimations?.[status] ?? roleAnimations?.default;
}
