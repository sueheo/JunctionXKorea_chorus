# GO Event Mapping

작성일: 2026-08-23  
목적: GO / AI:GO 로그를 RareSuSi 프론트엔드의 replay visualization state로 변환하기 위한 매핑 초안

---

## 1. 현재 결론

실제 GO 로그는 바로 UI 컴포넌트에 연결하지 않는다.

권장 흐름:

```text
GO Raw Event / History
        ↓
GO Log Parser
        ↓
Normalized Replay Event
        ↓
Squad Event Adapter
        ↓
Visualization State
        ↓
React UI
```

현재 프론트엔드는 이미 다음 구조를 갖고 있다.

```text
MockReplayEvent[]
        ↓
createVisualizationState()
        ↓
VisualizationState
        ↓
UI Components
```

따라서 다음 구현 단계에서는 GO 로그를 직접 UI state로 만들지 말고, 먼저 `MockReplayEvent`와 유사한 `NormalizedReplayEvent`로 바꾸는 parser를 만든다.

---

## 2. 확인한 GO 로그 파일

현재 workspace 기준으로 다음 파일을 확인했다.

```text
Go/logs/events.jsonl
Go/logs/history.json
Go/logs/<executionId>.jsonl
```

각 파일의 역할:

| 파일 | 확인된 역할 | 프론트 활용 |
| --- | --- | --- |
| `events.jsonl` | 구조화된 squad event stream | replay timeline 생성에 적합 |
| `history.json` | 실행별 task, agentName, output, token summary | agent 이름, task 상세, 결과 보강에 적합 |
| `<executionId>.jsonl` | 사람이 읽는 로그 메시지 stream | 쉬운 로그 문장 보강에 활용 가능 |

---

## 3. 확인된 Event Types

`Go/logs/events.jsonl`에서 확인한 event type은 다음과 같다.

| Event Type | 확인된 payload fields |
| --- | --- |
| `squad:planning-started` | `executionId`, `request`, `squadId` |
| `squad:plan-ready` | `autoApprove`, `executionId`, `planId`, `plannerWarning`, `squadId`, `taskCount`, `title`, `waves` |
| `squad:execution-started` | `executionId`, `squadId`, `totalTasks`, `totalWaves` |
| `squad:task-wave-started` | `executionId`, `squadId`, `taskIds`, `totalWaves`, `waveIndex` |
| `squad:task-status-changed` | `newStatus`, `oldStatus`, `squadId`, `taskId` |
| `squad:agent-state-changed` | `agentId`, `squadId`, `state` |
| `squad:task-completed` | `error`, `executionId`, `squadId`, `success`, `taskCounts`, `taskId`, `taskTitle` |
| `squad:aggregation-started` | `executionId`, `squadId`, `taskIds` |
| `squad:execution-completed` | `executionId`, `result`, `squadId`, `taskCounts`, `tokenUsage` |
| `squad:execution-token-usage` | `completionTokens`, `executionId`, `promptTokens`, `squadId`, `total` |
| `squad:workspace-file-changed` | `changeType`, `path`, `squadId` |
| `squad:token-usage-update` | `agentId`, `completionTokens`, `promptTokens`, `squadId`, `total` |

---

## 4. Current Visualization Model

현재 프론트엔드의 핵심 상태는 다음 타입으로 표현된다.

```ts
type VisualizationState = {
  run: RunSummary
  agents: VisualizationAgent[]
  logs: VisualizationLog[]
  latestLogId?: string
  activeAgentId?: string
  stageMessage: string
  steps: VisualizationStep[]
  reason: {
    title: string
    body: string
  }
  summary: ResourceSummary
  issue: {
    visible: boolean
    message: string
  }
}
```

GO 로그 연동은 이 `VisualizationState`를 직접 만들지 않고, 먼저 replay event로 정규화한 뒤 기존 adapter를 통과시킨다.

---

## 5. Event Mapping Draft

### 5.1 `squad:planning-started`

확인된 데이터:

- `executionId`
- `request`
- `squadId`
- `timestamp`

매핑 제안:

| Visualization | Mapping |
| --- | --- |
| `run.projectName` | `payload.request` 또는 history의 request |
| `stageMessage` | `문제를 살펴보기 시작했어요` |
| `steps` | `문제 찾기` active |
| `logs` | 진행 관리자 또는 system 로그 추가 |

Normalized event 후보:

```ts
{
  type: "run_started",
  at,
  message: "문제를 살펴보기 시작했어요"
}
```

활용 가능성: 높음

---

### 5.2 `squad:plan-ready`

확인된 데이터:

- `taskCount`
- `waves`
- `title`
- `plannerWarning`

매핑 제안:

| Visualization | Mapping |
| --- | --- |
| `stageMessage` | `작업 순서를 정하고 있어요` 또는 warning이 있으면 문제 발견 상태 |
| `logs` | 계획 준비 완료 로그 |
| `issue` | `plannerWarning`이 있으면 경고 표시 가능 |

주의:

- `waves`에는 taskId만 있으므로 agentName은 이 이벤트만으로 알기 어렵다.
- agentName 매핑은 `history.json` 또는 task 로그와 함께 보강해야 한다.

활용 가능성: 중간-높음

---

### 5.3 `squad:execution-started`

확인된 데이터:

- `totalTasks`
- `totalWaves`
- `executionId`

매핑 제안:

| Visualization | Mapping |
| --- | --- |
| `run.statusLabel` | `Running normally` |
| `stageMessage` | `팀이 작업을 시작했어요` |
| `logs` | 실행 시작 로그 |

활용 가능성: 높음

---

### 5.4 `squad:task-wave-started`

확인된 데이터:

- `waveIndex`
- `totalWaves`
- `taskIds`

매핑 제안:

| Visualization | Mapping |
| --- | --- |
| `stageMessage` | `새 작업 묶음이 시작됐어요` |
| `steps` | waveIndex에 따라 진행 단계 추정 |
| `logs` | wave 시작 로그 |

주의:

- wave가 RareSuSi의 `문제 찾기 -> 수정하기 -> 확인하기` 단계와 1:1 대응한다고 가정하면 안 된다.
- MVP에서는 wave를 replay timing에만 사용하고, 의미 단계는 task status / task title과 함께 추론한다.

활용 가능성: 중간

---

### 5.5 `squad:task-status-changed`

확인된 데이터:

- `taskId`
- `oldStatus`
- `newStatus`

매핑 제안:

| GO Status | Visualization |
| --- | --- |
| `pending` | `idle` |
| `in_progress` | `working` |
| `completed` | `completed` |
| `failed` | `error` |

주의:

- 이 이벤트에는 `agentId`가 없다.
- `taskId -> agentId` 매핑은 `history.json.tasks` 또는 task assignment 로그에서 보강해야 한다.

활용 가능성: 높음, 단 agent mapping 필요

---

### 5.6 `squad:agent-state-changed`

확인된 데이터:

- `agentId`
- `state`

매핑 제안:

| GO State | VisualizationAgent.status |
| --- | --- |
| `running` | `working` |
| `idle` | `idle` |

Normalized event 후보:

```ts
{
  type: "agent_status_changed",
  at,
  agentId,
  status: "working",
  statusLabel: "진행 중",
  currentTask: "작업을 진행하고 있어요"
}
```

주의:

- `agentId`는 있으나 사용자 친화적인 agentName은 이 이벤트에 없다.
- agentName은 `history.json.tasks[].agentName` 또는 `<executionId>.jsonl`의 assignment message에서 보강한다.

활용 가능성: 높음

---

### 5.7 `squad:task-completed`

확인된 데이터:

- `taskId`
- `taskTitle`
- `success`
- `error`
- `taskCounts`

매핑 제안:

| Visualization | Mapping |
| --- | --- |
| `logs` | 성공/실패 문장 추가 |
| `issue.visible` | `success === false`이면 true |
| `issue.message` | `error`를 쉬운 문장으로 요약 |
| `agent.status` | success면 `completed`, 실패면 `error` |

사용자 문장 예시:

```text
검사자가 문제를 발견했어요.
코드 작성자의 작업이 완료됐어요.
일부 작업이 실패해서 다시 확인이 필요해요.
```

활용 가능성: 높음

---

### 5.8 `squad:aggregation-started`

확인된 데이터:

- `taskIds`
- `executionId`

매핑 제안:

| Visualization | Mapping |
| --- | --- |
| `steps` | `확인하기` 또는 최종 정리 단계 active |
| `stageMessage` | `결과를 모아서 확인하고 있어요` |
| `logs` | 최종 정리 시작 로그 |

활용 가능성: 중간-높음

---

### 5.9 `squad:execution-completed`

확인된 데이터:

- `result`
- `taskCounts`
- `tokenUsage`

매핑 제안:

| Visualization | Mapping |
| --- | --- |
| `run.statusLabel` | `Replay complete` 또는 완료 상태 |
| `summary.totalTokens` | `tokenUsage.promptTokens + tokenUsage.completionTokens` |
| `steps` | 전체 완료 |
| `stageMessage` | `최종 결과를 확인했어요` |

활용 가능성: 높음

---

### 5.10 Token Usage Events

확인된 event:

- `squad:execution-token-usage`
- `squad:token-usage-update`

매핑 제안:

| Event | Visualization |
| --- | --- |
| `squad:execution-token-usage` | 전체 token summary |
| `squad:token-usage-update` | agent별 token bar |

주의:

- `history.json`의 일부 task tokenUsage는 0으로 기록되어 있다.
- token usage는 source별 신뢰도가 다를 수 있으므로 UI에서 "예상" 또는 "측정" 구분 가능성을 남긴다.

활용 가능성: 중간-높음

---

### 5.11 `squad:workspace-file-changed`

확인된 데이터:

- `path`
- `changeType`

매핑 제안:

| Visualization | Mapping |
| --- | --- |
| `logs` | `파일이 수정됐어요` |
| `stageMessage` | 코드 작성자 또는 관련 agent 작업으로 표시 |

주의:

- 이 이벤트만으로 어떤 agent가 수정했는지는 확실하지 않다.

활용 가능성: 중간

---

## 6. Agent Name Mapping

`events.jsonl`의 일부 이벤트에는 `agentId`만 있고 `agentName`이 없다.

보강 후보:

1. `history.json.tasks[]`
   - `agentId`
   - `agentName`
   - `taskId`
   - `title`
   - `status`
2. `<executionId>.jsonl`
   - assignment message에 agentName이 포함됨
   - 예: `Task 'Calculator UI Design' assigned to agent '프론트엔드 개발자'`

권장:

```text
history.json.tasks[]를 우선 사용하고,
부족한 경우 <executionId>.jsonl message parser로 보강한다.
```

---

## 7. Role Mapping Draft

GO 로그의 agentName은 현재 RareSuSi 캐릭터 역할과 정확히 일치하지 않을 수 있다.

초기 fallback 매핑:

| GO agentName 포함 문자열 | RareSuSi role |
| --- | --- |
| `프론트엔드`, `개발`, `코드` | 코드 작성자 |
| `리뷰`, `검토`, `검사` | 검사자 |
| `기획`, `계획`, `관리`, `router`, `planner` | 진행 관리자 |
| `기준`, `요구사항`, `명세` | 기준 작성자 |
| `최종`, `판정`, `aggregate`, `judge` | 최종 판정자 |

주의:

- 이 매핑은 임시 추론이다.
- 실제 Squad template에서 role metadata를 제공할 수 있으면 그 값을 우선해야 한다.

---

## 8. 확인된 것과 불확실한 것

### 확인된 것

- 실행 시작 / 계획 완료 / 실행 시작 / wave 시작 / task status / agent state / task completed / aggregation / execution completed 이벤트가 존재한다.
- timestamp가 있어 replay timing 계산이 가능하다.
- taskId와 agentId가 일부 이벤트에 존재한다.
- history.json에서 agentName, task title, status, error, output, duration, token summary를 확인할 수 있다.
- token usage update 이벤트가 일부 존재한다.

### 아직 불확실한 것

- 모든 실행에서 `events.jsonl` 이벤트 스키마가 항상 동일한지.
- taskId와 agentId를 항상 안정적으로 연결할 수 있는지.
- agent 간 실제 message/handoff 내용이 구조화되어 제공되는지.
- tool call 정보가 별도 이벤트로 제공되는지.
- token usage가 항상 정확히 기록되는지. 일부 history task tokenUsage는 0이다.
- 실시간 streaming이 demo 환경에서 안정적인지.

---

## 9. Recommended Implementation Order

### Step 1. Static parser

`events.jsonl`과 `history.json`을 입력으로 받아 특정 executionId의 raw event를 읽는다.

### Step 2. Normalize

GO raw event를 `NormalizedReplayEvent`로 변환한다.

초안 타입:

```ts
type NormalizedReplayEvent = MockReplayEvent & {
  source: "go-events-jsonl" | "go-history" | "go-log-jsonl"
  rawEventType?: string
  rawId?: string | number
}
```

### Step 3. Adapter reuse

정규화된 event를 현재 `createVisualizationState()`에 넣어 replay UI를 재사용한다.

### Step 4. Local JSON replay

처음에는 실시간 연결이 아니라 파일 기반 replay로 구현한다.

```text
sample GO log JSON
        ↓
parser
        ↓
NormalizedReplayEvent[]
        ↓
VisualizationState
```

### Step 5. Streaming spike

파일 기반 replay가 안정화된 뒤 WebSocket / SSE / polling 중 가능한 방식을 검토한다.

---

## 10. 다음 액션

다음 구현 커밋 후보:

```text
feat: add GO log normalization spike
```

구현 범위:

- `src/data/goSample/` 또는 `public/sample-go-events.json` 준비
- GO raw event 타입 정의
- `normalizeGoEvents()` 함수 작성
- 기존 mock replay와 동일한 UI에 연결 가능한지 검증

단, 실제 GO 연동은 아직 확정된 API가 아니므로 파일 기반 sample replay부터 진행한다.
