# RareSuSi

RareSuSi는 AI Squad가 문제를 해결하는 과정을 비전공자도 이해할 수 있도록 보여주는 JunctionX Korea 인터랙티브 웹 프로젝트입니다.

## Tech Stack

- Vite
- React
- TypeScript

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```text
src/
  components/          화면 영역별 React 컴포넌트
  data/                mock replay 데이터
  lib/                 Squad event adapter
  types/               시각화 상태 타입
  App.tsx              앱 레이아웃 조립
  main.tsx             React entry point
  styles.css           전역 스타일
docs/
  frontend-plan.md     프론트엔드 구현 방향 문서
```

## Current Scope

현재 단계는 Vite + React + TypeScript 스캐폴딩과 하이파이 초안 기반 화면 골격 구성입니다.
실제 GO / AI:GO 연동은 mock replay와 adapter 구조가 안정화된 뒤 진행합니다.
