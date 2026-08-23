# RareSuSi — 5-Minute English Pitch (v2)

> Arc: **Problem definition → Agent Squad → Visualization → Market & expected value.**
> Everything claimed about the visualization below is verified running in the current repo build —
> no roadmap features, no overclaiming.
> Target pace: ~130 wpm → ~660 spoken words. Script below fits.

---

## Timeline at a glance

| Time | Segment | Job it does |
|---|---|---|
| 0:00–0:55 | Problem definition (show of hands) | The room demonstrates the problem's two faces itself |
| 0:55–2:10 | The Squad: OneWave | Evidence-driven architecture, strongest numbers |
| 2:10–3:45 | The Visualization: live demo | Show the answer to the second face of the problem |
| 3:45–4:30 | Market & expected value | Why this outlives the hackathon |
| 4:30–5:00 | Close | One-sentence thesis |

---

## 0:00–0:55 — Problem definition (interactive opening)

**Slide: a wall of raw JSONL log text. Nothing else. It stays up behind the whole interaction.**

> "Before I show you anything — quick show of hands. Who here is **not** a developer?
> [pause — note the hands]
> Keep them up. You're exactly who we built this for — remember your hand.
> Now, developers, your turn. Hand up if an AI agent ever broke,
> you had no idea why, and you copy-pasted the error into a *different* AI
> and asked: 'what happened here?'
> [pause — most developer hands go up]
> Look around. Even the builders debug AI with AI.
> That's not a skill problem. **That's a visibility problem.**
> Two kinds of hands, one problem: builders can't see *why* their agents fail,
> and everyone else can't see *what* the agents did at all —
> because the only record is this. [gesture at the JSONL slide]
> We're team RareSuSi, and we built both halves of the answer:
> a squad designed from evidence, and a stage where anyone can watch it work."

*Why this works: the two rounds of hands physically demonstrate the problem's two faces — non-developers = the trust/comprehension face (Chorus's audience), developers = the building/visibility face (OneWave's evidence culture). The rest of the pitch just resolves what the room already admitted.*

**Callbacks planted here (use them later):**

- In the demo (~3:40): "Everyone who raised a hand in the *first* round — this stage is for you."
- In the market close (~4:25): "Every hand that went up in this room goes up in every company deploying agent teams. That's the market."

**Risk controls:**

- This opening needs a *room*, not a judging table. If the format turns out to be 3–5 judges at a desk, convert to the rhetorical version: same lines, no literal hands — "Most of you aren't developers... and the developers among you have all done this: pasted an agent's error into another AI and asked what happened."
- No-hands fallback line, delivered with a smile: "Just me? Fair enough — I did it twice yesterday." Then continue unchanged.
- The interaction costs ~30 seconds of the 55. The narration above is already compressed to fit; do not add back explanation the hands have already done for you.

## 0:55–2:10 — The Squad: OneWave

**Slide: 0.275 vs 0.277, then a 4-agent diagram with a single arrow.**

> "Face one first: does more coordination buy accuracy? We didn't guess —
> we analyzed all twenty-seven public runs on the leaderboard.
> gpt-oss-only squads versus mixed squads: average score 0.275 versus 0.277.
> Statistically identical. **Model choice doesn't decide this benchmark —
> architecture does.** And extra chatter doesn't buy points; it buys tokens.
> So our squad, OneWave, is deliberately quiet. Four agents:
> a Qwen3-32B planner — the planner's output is never graded, so paying
> double for it buys exactly zero points — and three gpt-oss-120b specialists,
> one per track. Each problem runs **exactly one wave, one task, one named solver**,
> whose output *is* the submitted answer. No debate loops, no retries.
> Every prompt was verified byte-for-byte against the official request fixtures.
> The result: our coding accuracy is 26.3 percent — **tied for the highest
> on the leaderboard** — on the track that carries half the benchmark weight."

## 2:10–3:45 — The Visualization: Chorus (live demo)

**Switch to the running app. Three beats, ~25 seconds each, then the punchline.**

> "Now face two: could you *watch* that happen? This is Chorus.
> The squad becomes an orchestra on a stage."

Demo beats — all verified working in the current build:

1. **Who has the baton** — "Each agent is a character with a live animation.
   The one lit up is the one working *right now* — named once by the planner,
   no guessing why. Status isn't a log level — it's a face: waiting, working,
   done, or in trouble."
2. **The story, not the log** — "Every event becomes a plain-language sentence,
   synchronized with the stage — 'the coder just finished its task' — and the
   activity log filters by working, done, or problem. Graphics plus words together:
   that's dual coding, and it's how non-experts actually comprehend a process."
3. **Resources in sight** — "Each agent carries its own live token meter, and the
   panel totals tokens and cost as the run plays — you watch the budget move,
   not audit it afterward."

> "And here's the part that matters: this is **not a scripted movie**.
> Chorus ingests the real AI:GO log schema — events and history, as emitted —
> so any run of any squad replays this way. What you just watched
> is a real execution, retold so that anyone in this room can follow it.
> Everyone who raised a hand in that *first* round — this stage is for you."

*(Production note: pick a demo replay that includes at least one failure event so beat 1's "in trouble" state actually appears on stage — the error animations exist for all five characters. When it does, extend beat 1 with one more line: "And when it's in trouble, the reason panel shows why, right there on stage." — this closes the track's own visualization checklist item on failure *reasons*, not just failure state. If the chosen replay has no failure, drop the words "or in trouble" and skip the reason-panel line entirely — don't reference a panel the audience won't see.)*

## 3:45–4:30 — Market & expected value

**Slide: three logos-style rows: AI teams / their stakeholders / everyone learning AI.**

> "The trust problem doesn't end with this benchmark. Agentic AI is projected
> to grow from about seven billion dollars this year to over ninety billion
> by 2032 — a forty-four percent CAGR. But Gartner's own research says only
> **seventeen percent** of enterprises have gotten an agent into real
> production, and predicts **over forty percent** of agentic AI projects
> get canceled by 2027 — not for lack of capability, for lack of trust.
> **Every hand that went up in this room goes up in every one of those
> companies. That's the market.**
> Chorus is a replay layer, not a dashboard for one product: anything that
> emits an event log can take this stage. Today's observability tools —
> Datadog, LangSmith, Langfuse — are built by engineers, for engineers.
> **The expected value of Chorus is everyone else in the room** — the demo
> that closes a deal, the audit that satisfies compliance, the classroom
> where someone sees, for the first time, how AI teams actually work."

## 4:30–5:00 — Close

**Slide: one line, stage screenshot behind it.**

> "So: can many small models beat one big one? Yes — when each plays exactly
> one note, at exactly the right time. And should anyone have to read JSON
> to believe it? Never again.
> One wave to solve it. One stage to show it. That's RareSuSi. Thank you."

---

## Q&A preparation

| Likely question | Answer line |
|---|---|
| "Your overall score is mid-table. Why should this win?" | "Benchmark is 40% of the rubric. On the axis worth half of it — coding — we're tied for #1. And the other 60% of the rubric is efficiency and explainability, which are exactly what OneWave and Chorus were each designed for." |
| "Is the visualization hardcoded to a demo run?" | "No — it normalizes the platform's fixed log schema, events plus history, so any execution replays the same way. The adapter is a pure function of elapsed time over that log." |
| "Why the orchestra metaphor — isn't it just decoration?" | "It's a comprehension device, grounded in learning-science: dual coding — synchronized graphics and plain language — measurably improves non-expert understanding versus either alone. The metaphor is the interface, the log is still the source of truth." |
| "Why no K-EXAONE?" | "3× cost, smallest usable context, and no accuracy edge in the observed data that survives the cost weighting. Every seat it could take, gpt-oss at 2× matched or beat it." |
| "Isn't one-task-one-wave just doing less?" | "Deliberately. The class-average data shows coordination overhead doesn't buy accuracy on this benchmark. Our planner still plans — dispatch is provable in the logs: one wave, one task, every time." |
| "Who actually pays for this after the hackathon?" | "The same buyers paying for observability tools today — except those tools serve engineers. Teams deploying agent squads need the demo, audit, and stakeholder-explanation layer; that's a gap, not a crowded market." |
| "Where do your market numbers come from?" | "MarketsandMarkets for the $7B→$93B agentic AI market size, Gartner's 2026 CIO survey for the 17%-in-production and 40%-cancellation figures, McKinsey's State of AI survey for the explainability-risk gap. Full citations are in the doc." |
| "How is this different from Datadog / LangSmith / Langfuse?" | "Those are engineer-facing consoles — traces, spans, token tables. Chorus renders the *same* event log as a narrated, animated stage a non-engineer can watch cold. We're not competing on trace depth; we're the layer above those tools for the stakeholders who'll never open a trace viewer." |
| "Your math accuracy trails the leader's 69%." | "True — math is 13 items at quarter weight. We put the design budget where half the points are, and that's where we're tied for first." |

## Delivery notes

- Numbers to memorize cold: **0.275 vs 0.277 · 26.3% · one wave, one task · 40/30/30**.
- Market numbers to memorize cold: **$7B → $93B by 2032 (44.6% CAGR) · 17% in production · 40%+ projects canceled by 2027**. (McKinsey's explainability stat is Q&A backup only, not spoken — two 17%s and two 40%s in one breath was confusing the segment, so it was cut from the script.)
- Demo transition (slide → browser) rehearsed to under 5 seconds; keep a screen recording as fallback in the deck.
- Natural speaker handoff: one voice for Problem + Squad (0:00–2:10), the visualization builder narrates the demo (2:10–3:45), either closes.
- Cut rule if running long: compress the Squad section's experiment detail first; never cut the demo or the market close — they carry the arc.
- The demo app's UI is Korean while the pitch is English — narrate each beat in English *as* it happens so the judges never need to read the screen.
- Do not claim rewind/scrubbing or model-weighted cost breakdowns; pause/stop and token/cost totals are what's on stage today, and the script above only claims those.

## Market data sources (for Q&A defense, Aug 2026)

- **Agentic AI market, $7.06B (2025) → $93.20B (2032), 44.6% CAGR** — [MarketsandMarkets, "Agentic AI Market Worth $93.20 billion by 2032"](https://www.marketsandmarkets.com/PressReleases/agentic-ai.asp). Other firms (Grand View Research, Precedence Research, Fortune Business Insights, Mordor Intelligence) independently size the near-term market at $7–8B with 40%+ CAGRs — the range is consistent across sources even where exact figures differ.
- **17% of enterprises have deployed AI agents to production; 40%+ of agentic AI projects predicted canceled by end of 2027** — [Gartner press release, June 25 2025](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027) (cancellation figure, cited from a Jan 2025 poll of 3,412 webinar attendees) and Gartner's 2026 CIO Survey (production-deployment figure, as reported by [digitalapplied.com](https://www.digitalapplied.com/blog/agentic-ai-project-cancellations-gartner-40-percent-2026)). Gartner also estimates only ~130 vendors are genuinely agentic out of thousands claiming to be ("agent washing").
- **40% of leaders cite explainability as their top AI risk; only 17% are mitigating it** — McKinsey, [The State of AI: Global Survey 2025](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai) (1,993 respondents, ~105 countries).
- **AI/LLM observability market: $1.97B (2025) → $2.69B (2026), 36.3% CAGR, →$9.26B by 2030** — [Research and Markets, "LLM Observability Platform Market Report 2026"](https://www.researchandmarkets.com/reports/6215671/large-language-model-llm-observability). Cited in the market section as "already a billion-dollar market growing over thirty percent a year"; not spoken as an exact figure to avoid an over-precise claim under time pressure.

*Note: figures above come from market-research firm reports (paid syndicated research), which carry wider margins of error than academic sources — multiple independent firms were checked and the estimates cluster consistently, but treat exact digits as directional, not audited.*
