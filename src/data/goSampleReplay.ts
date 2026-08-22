import type { GoHistory } from "../types/goLog";
import type { MockReplay } from "../types/visualization";
import { createGoReplay, parseGoJsonl } from "../lib/goLogNormalizer";
import eventsJsonl from "./goSample/events.jsonl?raw";
import historyJson from "./goSample/history.json";
import { mockReplay } from "./mockReplay";

const sampleExecutionId = "5514f524-8fc1-4664-a207-2113c8e2a108";

export const goSampleReplay: MockReplay = createGoReplay(parseGoJsonl(eventsJsonl), historyJson as GoHistory, {
  baseAgents: mockReplay.baseAgents,
  executionId: sampleExecutionId,
});
