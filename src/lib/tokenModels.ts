import type { TokenModelName, VisualizationAgent } from "../types/visualization";

export const tokenModelProfiles: Record<TokenModelName, { label: string; multiplier: number }> = {
  Qwen: {
    label: "Qwen",
    multiplier: 1,
  },
  GPT: {
    label: "GPT",
    multiplier: 2,
  },
  EXAONE: {
    label: "EXAONE",
    multiplier: 3,
  },
};

export function getAgentTokenUsage(agent: VisualizationAgent) {
  const profile = tokenModelProfiles[agent.modelName];
  const weightedUsed = agent.tokenUsed * profile.multiplier;
  const weightedLimit = agent.tokenLimit * profile.multiplier;

  return {
    modelLabel: profile.label,
    multiplier: profile.multiplier,
    percent: weightedLimit > 0 ? Math.min((weightedUsed / weightedLimit) * 100, 100) : 0,
    weightedLimit,
    weightedUsed,
  };
}

export function formatTokenCount(tokens: number) {
  if (tokens >= 1000) {
    const value = tokens / 1000;
    return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)}k`;
  }

  return `${Math.round(tokens)}`;
}
