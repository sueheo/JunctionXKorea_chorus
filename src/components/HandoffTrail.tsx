import type { HandoffTrailNode, VisualizationAgent } from "../types/visualization";

type HandoffTrailProps = {
  agents: VisualizationAgent[];
  nodes: HandoffTrailNode[];
};

export function HandoffTrail({ agents, nodes }: HandoffTrailProps) {
  if (nodes.length === 0) {
    return null;
  }

  const agentById = new Map(agents.map((agent) => [agent.id, agent]));

  return (
    <nav className="handoff-trail" aria-label="에이전트 작업 전달 흐름">
      {nodes.map((node, index) => {
        const agent = agentById.get(node.agentId);

        if (!agent) {
          return null;
        }

        return (
          <span className="handoff-trail-group" key={node.id}>
            <span className={`handoff-agent ${node.state}`} title={node.label}>
              {agent.assetSrc ? (
                <img alt={`${agent.name} 에이전트`} src={agent.assetSrc} />
              ) : (
                <span className={`agent-avatar ${agent.role}`} style={{ backgroundColor: agent.color }}>
                  {agent.name.slice(0, 1)}
                </span>
              )}
              <span>{node.label}</span>
            </span>
            {index < nodes.length - 1 ? (
              <span className={`handoff-connector ${resolveConnectorState(nodes[index + 1])}`} aria-hidden="true">
                <i />
                <i />
                <i />
                <b />
              </span>
            ) : null}
          </span>
        );
      })}
    </nav>
  );
}

function resolveConnectorState(nextNode: HandoffTrailNode) {
  if (nextNode.state === "done") {
    return "done";
  }

  if (nextNode.state === "active") {
    return "active";
  }

  return "upcoming";
}
