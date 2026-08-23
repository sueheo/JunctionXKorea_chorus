import type { MockReplay, MockReplayEvent } from "../types/visualization";
import { goSampleReplay } from "./goSampleReplay";

export type ReplayScenarioId = "success" | "error";

export type ReplayScenario = {
  id: ReplayScenarioId;
  label: string;
  replay: MockReplay;
};

const errorDemoReplay = createErrorDemoReplay(goSampleReplay);

export const replayScenarios: ReplayScenario[] = [
  {
    id: "success",
    label: "성공 로그",
    replay: goSampleReplay,
  },
  {
    id: "error",
    label: "에러 로그",
    replay: errorDemoReplay,
  },
];

function createErrorDemoReplay(baseReplay: MockReplay): MockReplay {
  const failureRawId = 71;
  const fallbackFailureEvent = baseReplay.events.find((event) => event.rawEventType === "squad:task-completed");
  const failureEvent =
    baseReplay.events.find((event) => event.rawId === failureRawId && event.type === "log_added") ??
    fallbackFailureEvent;
  const failureAt = failureEvent?.at ?? Math.min(baseReplay.durationSeconds, 12);
  const failureMessage = "src/api.py 테스트에서 HTTP 504 Gateway Timeout 오류가 발생했어요";
  const rawTraceMessage =
    "Task 'Back-End Sample API' failed: LLM call failed: API error: HTTP 504 Gateway Timeout: request timed out";

  const events = baseReplay.events
    .filter((event) => event.at <= failureAt && event.type !== "run_completed")
    .map((event): MockReplayEvent => {
      if (event.rawId !== failureRawId) {
        return event;
      }

      if (event.type === "agent_status_changed") {
        return {
          ...event,
          status: "error",
          statusLabel: "문제",
          currentTask: "백엔드 API 테스트가 실패했어요",
          rawTraceLevel: "ERROR",
          rawTraceMessage,
        };
      }

      if (event.type === "log_added") {
        return {
          ...event,
          type: "issue_found",
          status: "error",
          icon: "issue",
          message: failureMessage,
          rawTraceLevel: "ERROR",
          rawTraceMessage,
          reason: {
            title: "왜 replay가 멈췄나요?",
            body: "백엔드 API 검증 중 HTTP 504 timeout이 발생했어요. Raw Trace에서 실패한 task와 원본 오류 메시지를 확인할 수 있어요.",
          },
        };
      }

      return event;
    });

  return {
    ...baseReplay,
    projectName: "백엔드 API 실패 데모",
    durationSeconds: failureAt + 2,
    events,
  };
}
