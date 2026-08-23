# Pitch Deck Review: RareSuSi (OneWave + Chorus)

**Review Date:** 2026-08-23
**Deck Version:** `docs/PITCH_5MIN_EN.md` (v2, as edited this session)
**Stage:** Hackathon submission — pre-company, no fundraise, no product outside the hackathon build
**Industry:** Agentic AI orchestration (OneWave) + AI agent observability/explainability (Chorus)
**Reviewer:** Claude Pitch Deck Reviewer

---

## Calibration note (read this first)

This framework is built for VC fundraising decks. This document is a **5-minute spoken hackathon pitch script**, not a fundraising deck — there is no ask, no company, no financial model, and the "investor" in the room is a hackathon judge scoring against a rubric, not a partner deciding whether to wire money. Three of the eight scored dimensions (Financial Projections, Team Credibility, Ask Clarity) are structurally inapplicable here and will score 1-3 by design, not because the founders did anything wrong. I score them per the methodology as instructed, but I also compute a **second, reweighted score** across only the five dimensions that actually apply to a judged hackathon pitch (Narrative Flow, Problem/Solution, Market Sizing, Competitive Positioning, Traction/Validation), because the raw VC-weighted number below is not a fair read of this document.

I did not treat this as a blind first read: earlier in this session I already worked on this document with the team (added sourced market statistics, trimmed the market section for pacing, added competitive positioning against Datadog/LangSmith/Langfuse). This review evaluates the **current, already-improved state** of the file, and is intentionally more skeptical of the parts we have not yet touched — narrative pacing math, naming clarity between OneWave and Chorus, and the fully-absent VC-style sections.

---

## Executive Summary

*(Corrected after author clarification — see note below the table.)*

The strongest thing in this document is structural: the two-round "show of hands" cold open plants a problem framing (developers vs. non-developers, "visibility" as the unifying word) that gets explicitly paid off twice later — in the demo transition and in the market close. That callback discipline is rare; most pitches state a problem once and never return to it. The demo section is evidence-first and self-policing (it explicitly refuses to claim rewind/scrubbing or features not in the build), which is a real credibility asset with a technical judge.

**Author clarification received after the first draft of this review:** OneWave is not a second, deliberately-branded product — it is the name the AI:GO benchmark platform assigned to the squad configuration. Chorus is the one product the team actually built and branded (including its character animations). This resolves the coherence concern the first draft of this review raised as its top finding (an earlier version of this section argued the pitch reads as "two products stitched together"): Chorus's value proposition doesn't depend on OneWave being good — Chorus is squad-agnostic by design ("any run of any squad replays this way") — so OneWave's accuracy is supporting evidence of a real, high-quality execution being shown on stage, not a second thesis that needs to logically fuse with Chorus's. The one residual risk is naming, not logic: a judge unfamiliar with the platform may not realize "OneWave" is platform-assigned rather than team-branded, and could read the pitch as covering two team-chosen products rather than one product (Chorus) plus the evidence behind its demo content (OneWave). See the revised Objection 1 and Improvement 2 below for the low-cost fix.

The remaining critical gap is arithmetic, not narrative: Segment 1's stated time budget (55 seconds, minus ~30 seconds of audience interaction, leaving ~25 seconds of narration) does not match the ~130+ words of narration written for it — at the deck's own 130 wpm target that's roughly 2.5x the available time, a real risk of the cold open running long and eating into the demo.

**Overall Score (VC-weighted, as specified by the framework): 5.5 / 10 — Needs Work**
**Overall Score (hackathon-reweighted, five applicable dimensions only): 7.3 / 10 — Good**

The VC-weighted score is dragged down almost entirely by three dimensions (Financials, Team, Ask) that do not apply to a judged hackathon pitch with no fundraising ask; treat the 7.3 as the more substantively meaningful of the two generic-framework numbers. But neither VC-framework number is the score that actually matters here — see **Track Rubric Cross-Check** immediately below for how this pitch maps to the official Lablup × FuriosaAI grading axes (Benchmark Performance 40% / Efficiency 30% / Visualization 30%), including a line-by-line check against the track's own published 8-item visualization checklist.

---

## Track Rubric Cross-Check (Lablup × FuriosaAI official criteria)

*Added per author request. Cross-referenced against `docs/Lablup_Furiosa_Track.md` (official track rules, synced 2026-08-23) and `squad-templates/TRACK_SUBMISSION.md` (submission source of truth, FINAL v2). This section scores how well the pitch **argues and evidences** each official grading axis to a judge — it does not re-score the underlying technical submission itself, which is outside what a pitch review can assess. Every numeric rubric claim already in the pitch (the internal leaderboard weights 0.50 coding / 0.25 math / 0.25 generic, "coding carries half the benchmark weight," the 40/30/30 split cited in the Q&A) was checked against the track doc and is accurate — nothing here needed correction on that front, which is itself a strength worth noting: the Q&A's phrasing ("Benchmark is 40% of the rubric. On the axis worth half of it — coding — we're tied for #1.") correctly nests the two weightings instead of implying coding alone is worth "half of everything."

### Benchmark Performance (40% of total score) — pitch coverage: Strong, with one silent sub-track

Segment 2 is well-matched to this axis: the null-result framing (0.275 vs 0.277 across 27 runs) plus the headline 26.3% coding accuracy, tied for #1, directly serves "정확도" (accuracy). The Q&A's honest handling of the math weakness (trailing the leader's 69%, correctly contextualized as 13 items at quarter weight) serves the same axis without hiding the weak spot — consistent with the document's stated "no overclaiming" standard.

Two gaps against this specific axis:
- The rubric explicitly grades "정확도와 **안정성**" (accuracy *and stability*), but nothing in the pitch speaks to stability/consistency across runs — the 0.275-vs-0.277 comparison shows a mean, not a variance. If the underlying data supports a stability claim (e.g., low variance across the 27 runs), it's a cheap addition in the same evidentiary style as the rest of Segment 2. If it doesn't, avoid implying stability was demonstrated.
- The Generic track (96 items, 0.25 weight — equal to Math) is never mentioned anywhere in the pitch or Q&A. Coding gets a headline number and Math gets an honest acknowledgment of weakness; Generic gets silence. A judge working from the track doc could reasonably ask about it, and there's currently no prepared line.

### Efficiency (30% of total score) — pitch coverage: Argued qualitatively, never quantified

This is the axis the pitch defends best in *reasoning* and worst in *evidence*. Segment 2's architectural choices are all efficiency-justified and specific (Qwen3-32B planner because its output isn't graded, no debate loops because "extra chatter doesn't buy points, it buys tokens"), and the Q&A's K-EXAONE rejection is a genuinely sharp, specific efficiency argument ("3× cost, smallest usable context, no accuracy edge that survives cost weighting"). Demo beat 3 reinforces this visually with the live token/cost meter.

What's missing is a number. Efficiency is 30% of the total score — as much weight as Visualization, and three-quarters the weight of Benchmark Performance — yet unlike Benchmark Performance, it never gets a headline figure. The team already has what it needs to compute one: the track doc publishes exact relative costs (Qwen3-32B 1×, gpt-oss-120b 2×, K-EXAONE 3×) and the squad's own composition (1 planner + 1 solver per track, one wave, no retries) is fully known. A single self-calculated figure — e.g., "our squad's relative cost per problem is roughly N×, versus what an all-gpt-oss or K-EXAONE-inclusive squad would cost" — would give this axis the same evidentiary weight the pitch already gives Benchmark Performance, using data the team already has in hand.

### Visualization (30% of total score) — checked against the track's own 8-item checklist (§10)

The track document publishes exactly what it's looking for in this axis. Checking the pitch's three demo beats against it directly:

| # | Track checklist item (§10) | Addressed in pitch? | Evidence |
|---|---|---|---|
| 1 | 문제 해결 단계가 시간 순서로 보이는가 (chronological steps visible) | **Yes** | Beat 1: live per-agent status ("waiting, working, done, or in trouble") |
| 2 | 어떤 에이전트가 왜 호출됐는가 (which agent, and *why*) | **Partial** | Beats 1–2 show *which* agent is active and *what* it did ("the coder just finished its task"); no beat narrates *why* that agent was dispatched. The dispatch-reasoning claim currently lives only in the Q&A ("dispatch is provable in the logs"), not on stage. |
| 3 | 에이전트 간 입력·출력·책임 추적 (input/output & responsibility traceable) | **Not claimed** | No beat or line asserts this is visible during the live demo. |
| 4 | 실패와 재시도 이유 (failure/retry *reasons*, not just failure state) | **Partial, conditional** | The production note reveals a "reason panel" exists in the app, but the script only mentions it as something to leave *unaddressed* if the chosen replay has no failure — it is not a planned, narrated beat even in the case where a failure *is* present. |
| 5 | 최종 답 도달 근거·검증 단계 (reasoning/verification path to the final answer) | **Not claimed** | Nothing in the three beats or the narration claims this is shown. |
| 6 | 모델별 호출 수·토큰·비용 비교 (per-model calls/tokens/cost comparison) | **Yes** | Beat 3, explicitly: "each agent carries its own live token meter... totals tokens and cost." |
| 7 | 비전공자도 흐름을 이해 (non-experts understand the flow) | **Yes** | Dual-coding rationale, the "two hands" framing, "anyone in this room can follow it." |
| 8 | 로그 나열을 넘어 개선 인사이트 제공 (insight beyond raw log listing) | **Not claimed** | The pitch's own verb is "retold," not "analyzed" — nothing claims Chorus surfaces a pattern or recommendation the raw log wouldn't already show. |

5 of 8 items are fully or partially covered; three (#3, #5, #8) are entirely unaddressed, and two of the partial ones (#2, #4) are the highest-leverage gaps because the underlying capability may already exist in the running app (the "reason panel" reference in the production note implies #4's data is available) — meaning the fix could be a narration change, not new engineering.

### Track-Specific Recommendations

1. **Narrate the dispatch reason, not just the dispatch itself** — add one clause to beat 1 or 2 stating *why* the active agent was called (e.g., "the planner routed this to the coder because..."), directly targeting checklist item #2. Low cost, high leverage: this is the single most repeatable line across every replay Chorus can show.
2. **When a failure is present in the chosen replay, actually narrate the reason panel** rather than treating it as a contingent aside to drop if unlucky — targets checklist item #4, and per the production note, the underlying feature already exists.
3. **Add one self-calculated Efficiency number** (relative cost multiple, per the Efficiency section above) — this is the single largest gap between "how well-argued is this axis" and "how much is this axis worth" (30% of the total score, currently zero quantified backing).
4. **Add a one-line Q&A fallback for Generic track performance** — low priority, but currently the only one of the three benchmark sub-tracks with no prepared answer at all.

---

## Slide-by-Slide Analysis

*The source document is a spoken script with embedded slide descriptions, not a visual deck — "slide" below maps to the five timed segments plus the Q&A/delivery appendix.*

### Segment 1 (0:00–0:55): Problem definition — interactive open

**Content Summary:** Two rounds of audience hand-raising (non-developers, then developers who've debugged AI with AI) resolve into "that's a visibility problem," then a one-line team intro.
**Purpose:** Make the room self-demonstrate both faces of the problem before any claim is made.
**Effectiveness:** High as written, but see the timing risk below — effectiveness depends on a piece of stage math that currently doesn't close.

**Strengths:**
- Using the audience's own hands as evidence is stronger than any statistic could be in the first 30 seconds — it's un-arguable.
- The "keep them up... remember your hand" instruction is a genuine narrative-craft move: it converts a live audience action into a plantable Chekhov's gun, paid off in Segments 3 and 4.
- A documented fallback (no-hands joke) and a judging-table variant (rhetorical, no literal hands) show the team has rehearsed for format uncertainty, not just content.

**Weaknesses:**
- Time budget doesn't reconcile: the doc states the interaction costs ~30s of the 55s segment, leaving ~25s for narration. The narration block is ~130+ words; at 130 wpm that needs ~60s, not 25s. Either the interaction is faster than estimated, the narration needs cutting, or the segment is already running ~35s over before segment 2 even starts.
- The problem is asserted ("that's a visibility problem") immediately after the hands go up, with no half-second of dwell time in the script for the room to feel the "oh" — worth a beat/pause marker here the way beat 1 has one in the demo section.

**Recommendations:**
- Re-time this segment with a stopwatch read-through, not a word-count estimate; if it's genuinely long, cut from here first, not from the Squad section (per the doc's own cut rule, which currently protects the wrong segment given this finding).
- Add an explicit pause marker after "That's a visibility problem" to let the line land before continuing.

---

### Segment 2 (0:55–2:10): The Squad — OneWave

**Content Summary:** Class-average leaderboard analysis (0.275 vs 0.277 across 27 runs) used to argue architecture > model choice; introduces the 4-agent OneWave design; closes on 26.3% coding accuracy, tied for #1.
**Purpose:** Establish technical credibility and evidence-driven decision-making before the room sees anything visual.
**Effectiveness:** High. This is the deck's best-evidenced section.

**Strengths:**
- Leads with a null result ("statistically identical") rather than a favorable one — this is a genuinely unusual and credible move; most pitches only show data that flatters them.
- Every design choice is given a stated reason tied back to the data (planner not graded → don't pay for a bigger planner; no debate loops → extra chatter buys tokens not points). This is defensible under a "why did you build it this way" cross-exam.
- "Verified byte-for-byte against the official request fixtures" is a specific, checkable claim, not a vague assurance.

**Weaknesses:**
- This section never states that "OneWave" is the AI:GO platform's assigned name for the squad configuration, not a second team-branded product. Nothing here is factually wrong, but a judge unfamiliar with the benchmark could easily assume OneWave and Chorus are two equally-deliberate brands, which invites an unnecessary "is this one product or two?" question that a single clause would preempt.
- No mention of what the mixed-vs-single-model finding *cost* to discover (how many runs, how much compute) — not required, but it's the one place a "why now" (compute got cheap enough to run this analysis) could be earned instead of asserted.

**Recommendations:**
- Add a brief, low-cost clarifying clause the first time "OneWave" appears, e.g.: *"— that's the benchmark's name for our squad; Chorus is what we built —"*. This removes the one naming ambiguity in the pitch at essentially zero cost to pacing.

---

### Segment 3 (2:10–3:45): The Visualization — Chorus (live demo)

**Content Summary:** Three ~25-second demo beats (status-as-character, story-not-log, live resource meters) plus a "this is not scripted" credibility close and the first callback payoff.
**Purpose:** Show, don't tell, the solution to face two of the problem.
**Effectiveness:** High — this is a demo-first, show-don't-tell structure exactly as the framework's benchmark order recommends, and it's the deck's emotional and evidentiary peak.

**Strengths:**
- The "not a scripted movie" line, backed by "ingests the real AI:GO log schema," directly preempts the single most obvious skeptical question about any live-looking demo (is this real or a rehearsed animation).
- The production note (pick a replay with a failure event, with an explicit fallback line to drop if none exists) shows the team is managing demo risk deliberately, not hoping for the best.
- The callback ("Everyone who raised a hand in that first round — this stage is for you") lands at exactly the moment it's earned — right after the audience has watched the payoff, not before.

**Weaknesses:**
- "Dual coding... measurably improves non-expert understanding versus either alone" is a learning-science claim used as a justification, but it's not sourced anywhere in the document the way the market claims now are. It's asserted with the same confidence as the cited stats around it, which creates an inconsistent evidence bar within the same document.

**Recommendations:**
- Either cite a source for the dual-coding claim (Mayer's multimedia learning principle is the standard citation and is well-established, so this should be an easy fix) or soften it to "the working theory behind the design is dual coding" so the confidence level matches what's actually backed by a citation elsewhere in the doc.

---

### Segment 4 (3:45–4:30): Market & expected value

**Content Summary:** Sourced agentic-AI market growth figures ($7B→$93B, 44.6% CAGR), Gartner production/cancellation stats (17% / 40%+), named competitors (Datadog, LangSmith, Langfuse), closing on "the expected value of Chorus is everyone else in the room."
**Purpose:** Establish that the problem and the opportunity outlive this specific hackathon and this specific benchmark.
**Effectiveness:** Medium-high. This section was already tightened this session (from 207 to 159 spoken words, removing a confusing double-17%/double-40% collision) and had real competitor names added — both are legitimate, evidenced improvements over the prior draft.

**Strengths:**
- Every number here is now sourced, with a citations appendix and an honest note that market-research-firm figures carry wider error bars than academic sources — this is exactly the kind of self-aware sourcing the framework rewards and most decks (VC or hackathon) skip entirely.
- Naming Datadog/LangSmith/Langfuse directly is a real strength: it replaces "we have no competition"-style vagueness with an honest, checkable landscape.

**Weaknesses:**
- The market sizing is top-down only: "$7B→$93B agentic AI market" and "$1.97B→$2.69B LLM observability market" are both industry-wide TAM figures with no SAM (what slice of that is teams running multi-agent squads specifically) or SOM (what's realistically reachable). The framework flags TAM-only sizing as a red flag; it's an accurate one here even after this session's sourcing pass.
- The competitive positioning line ("layer above those tools for stakeholders who'll never open a trace viewer") asserts differentiation but doesn't address durability — nothing here answers "what happens when Datadog ships a narrated view next quarter," which is the natural next question from anyone who knows that market.

**Recommendations:**
- If time allows, replace one of the two top-down market stats with a single bottom-up sentence anchored to something the team already has data on — e.g., a count derived from the hackathon's own leaderboard (how many teams/squads are represented) as a proxy for "teams already running agent squads today" — rather than adding a fabricated SAM number.
- Add one clause on durability/moat, even a lightweight one: what compounds here (e.g., the log-schema-agnostic replay layer working across squads, not just one product) that a single vendor feature copy wouldn't erase.

---

### Segment 5 (4:30–5:00): Close

**Content Summary:** One rhetorical question-and-answer pair ("can many small models beat one big one? Yes") plus the "one wave, one stage" tagline.
**Purpose:** Inspire and land a single memorable thesis.
**Effectiveness:** High for a 30-second close — short, quotable, and it references both halves of the product (OneWave, Chorus) symmetrically in one line.

**Strengths:**
- "One wave to solve it. One stage to show it." is a genuinely good tagline — it's short, it names both products, and it scans well spoken aloud.

**Weaknesses:**
- None significant for a segment this short and this well-scoped to its job.

**Recommendations:**
- None required.

---

### Appendix: Q&A prep, Delivery notes, Market data sources

**Content Summary:** Eight anticipated questions with answer lines (including two genuinely tough ones the team chose not to dodge — mid-table overall score, math trailing the leader), delivery/rehearsal notes, and a sourced market-data appendix.
**Purpose:** Preparedness under cross-examination and post-session defensibility.
**Effectiveness:** High. This is unusually thorough for a hackathon submission and is arguably doing more real risk-reduction work than any single segment of the pitch itself.

**Strengths:**
- The Q&A table includes self-critical questions ("your overall score is mid-table," "your math accuracy trails the leader's 69%") with direct, non-evasive answers — this is a strong credibility signal; most decks only prep for softball questions.
- The sourcing appendix added this session gives a real, checkable paper trail for every market claim, including an honest caveat about syndicated market-research margins of error.

**Weaknesses:**
- No prepared answer for "what stops [named competitor] from copying this" despite now naming three real competitors in the body — this is the most likely next question after the new competitive-positioning line and isn't covered.
- No prepared line for "is OneWave a second product?" — low-severity given the true answer is simple (see Objection 1), but still worth having ready rather than improvised.

**Recommendations:**
- Add both missing Q&A rows now, while the answers are still fresh from this review, rather than improvising them live.

---

## Dimension Scores

| Dimension | Score | Weight | Weighted |
|---|---|---|---|
| Narrative Flow and Story Arc | 8/10 | 15% | 1.20 |
| Problem/Solution Clarity | 8/10 | 15% | 1.20 |
| Market Sizing Methodology | 6/10 | 12% | 0.72 |
| Competitive Positioning | 6/10 | 10% | 0.60 |
| Financial Projections Realism | 2/10 | 12% | 0.24 |
| Team Credibility | 3/10 | 12% | 0.36 |
| Ask Clarity and Use of Funds | 2/10 | 12% | 0.24 |
| Traction and Validation | 8/10 | 12% | 0.96 |
| **Overall (VC-weighted)** | | **100%** | **5.52** |

**Hackathon-reweighted (Narrative, Problem/Solution, Market, Competitive, Traction only, renormalized to 100%):**

| Dimension | Score | Reweighted % | Weighted |
|---|---|---|---|
| Narrative Flow and Story Arc | 8/10 | 23.4% | 1.87 |
| Problem/Solution Clarity | 8/10 | 23.4% | 1.87 |
| Market Sizing Methodology | 6/10 | 18.8% | 1.13 |
| Competitive Positioning | 6/10 | 15.6% | 0.94 |
| Traction and Validation | 8/10 | 18.8% | 1.50 |
| **Overall (hackathon-reweighted)** | | **100%** | **7.30** |

### Dimension Detail

#### 1. Narrative Flow and Story Arc — 8/10

The two-hands callback structure (planted in Segment 1, paid off in Segments 3 and 4) is the single best piece of narrative craft in the document — it's the kind of structural device that most professionally-coached pitches don't have. The "face one / face two" transactional framing between Segments 2 and 3 is a clean, explicit transition that never leaves the audience wondering where they are in the argument. Momentum is well-managed: the demo (Segment 3) is correctly placed as the emotional peak, and the market section correctly drops into a more analytical register before the close re-elevates.

The deduction is for achievability, not design: Segment 1's narration-to-time-budget mismatch (documented above) is a real risk that the opening — the highest-leverage 55 seconds in the entire pitch — runs long, which either eats into the demo (the actual proof) or forces a rushed, less confident delivery of the one section built to feel spontaneous. A story arc that's well-designed on paper but not verified against a stopwatch is still a flow risk in practice.

#### 2. Problem/Solution Clarity — 8/10

The problem is unusually well-demonstrated for this stage: rather than describing "AI logs are hard to read," the script puts a literal wall of raw JSONL on screen and uses the room's own hands as evidence that the problem is real and two-sided. That's a genuine strength — it passes the "problem makes you wince" bar because it's shown, not asserted.

The solution-to-problem mapping is cleaner than an earlier draft of this review judged it to be: Chorus (the one product) maps directly to "everyone else can't see what the agents did," and because Chorus is squad-agnostic by design — it replays *any* squad's log, not specifically OneWave's — it doesn't need OneWave to be accurate in order for the thesis to hold. OneWave's strong benchmark result functions as good supporting evidence (the demo shows a genuinely high-quality execution, not a contrived one), not as a second problem/solution pair that needs to logically fuse with Chorus's. The remaining deduction is narrower than "solution doesn't match problem": it's that the pitch doesn't yet clarify, on first mention, that "OneWave" is the benchmark platform's name for the squad rather than a second team-chosen brand — a naming clarity gap, not a logic gap (see Segment 2 recommendation and Objection 1).

#### 3. Market Sizing Methodology — 6/10

This dimension improved materially this session — going from zero sourcing to a fully cited appendix with cross-validated figures from multiple independent research firms and an honest note about the error margins inherent to syndicated market research is genuinely good practice, and better sourcing discipline than most seed-stage decks show. It avoids the worst version of this red flag (a single, cherry-picked report) by explicitly noting four independent firms cluster in the same $7-8B range.

It remains capped in the middle of the scale because the sizing is TAM-only: there is no SAM (what fraction of that agentic-AI market is specifically teams running multi-agent squads with a visibility gap) and no SOM (what's realistically reachable). For a hackathon pitch this is a reasonable simplification, not a fatal flaw — but per the framework's stated preference for bottom-up sizing, it caps the ceiling on this dimension regardless of stage.

#### 4. Competitive Positioning — 6/10

This is the other dimension that improved concretely this session: the pitch went from an unnamed, generic "agent observability today is built by engineers, for engineers" to naming three real, checkable competitors (Datadog, LangSmith, Langfuse) and giving Chorus an explicit value-chain position ("the layer above those tools"). That's the single biggest jump away from the framework's worst red flag ("we have no competitors").

The score doesn't go higher because durability is unaddressed. The framework specifically checks for "what happens when incumbents copy the feature," and nothing in the pitch or the Q&A currently answers that. A narrated, animated replay of an existing log schema is a feature any of the three named competitors could plausibly ship — the pitch needs one sentence on what wouldn't transfer if they did (e.g., the schema-agnostic replay approach, or a design philosophy those engineer-first tools structurally won't prioritize).

#### 5. Financial Projections Realism — 2/10

None present: no revenue model, no unit economics, no cost structure. This is fully expected and appropriate — this is a hackathon judging script with no fundraising ask, not a company raising capital, so there is nothing to project. Scored per the framework's instruction to mark absent major sections low, but this should not be read as a defect in the pitch; see the calibration note at the top of this review.

#### 6. Team Credibility — 3/10

The only team content is "We're team RareSuSi, and we built both halves of the answer" — a name and an implicit claim of authorship, no stated domain expertise or founder-market fit. For a hackathon this is largely a non-issue (judges typically assess the team through the live Q&A and the working build itself, not a bio slide), which is why this scores above the Financials/Ask floor rather than at it. If there's any spare capacity in the script, a single earned line establishing why this team specifically noticed this problem would cost little and isn't currently there.

#### 7. Ask Clarity and Use of Funds — 2/10

No ask, because there is nothing to ask for — this is a competition entry, not a fundraise. Scored low per the framework's methodology; this dimension is the clearest example of why the VC-weighted overall score (5.37) understates this document's real quality for its actual purpose, and why the hackathon-reweighted score (7.07) is the more meaningful number.

#### 8. Traction and Validation — 8/10

For a hackathon-stage technical entry, this is the strongest dimension after Narrative Flow, and it's underrated by a generic reading of the rubric because the "traction" here is evidentiary, not commercial: 27 public leaderboard runs analyzed, prompts verified byte-for-byte against official fixtures, a working demo that ingests the platform's real log schema rather than a scripted mock, and — notably — a willingness to state where the results are weak (math accuracy trailing the leader's 69%, addressed head-on in Q&A rather than omitted). That combination of specificity and self-critical honesty is exactly what the framework's top band ("comprehensive metrics... clear... proof") is describing, adapted to what "proof" means for a technical hackathon build rather than a company with paying customers.

---

## Design and Visual Communication Notes

This document is a script with brief slide descriptions ("Slide: a wall of raw JSONL log text," "Slide: 0.275 vs 0.277, then a 4-agent diagram"), not the visual deck itself — there isn't enough here to score visual design, and design is unscored in this framework regardless. Two structural notes worth flagging for whoever builds the actual slides:

- The market section's slide direction ("three logos-style rows: AI teams / their stakeholders / everyone learning AI") should be revisited to match the trimmed spoken content — it currently references a three-audience framing the spoken text no longer walks through in that order.
- Given how much of this pitch's credibility rests on specific, checkable numbers (0.275 vs 0.277, 26.3%, $7B→$93B, 17%, 40%+), each of those numbers earns a moment on screen as text, not just in the spoken track — numbers spoken but not shown are harder for a judge to write down accurately when scoring later.

---

## Top 5 Improvements

### 1. Reconcile Segment 1's time budget against its actual word count

**Current State:** The doc claims 55 seconds total, ~30 seconds of interaction, leaving ~25 seconds of narration — but the narration block is long enough to need roughly 60 seconds at the stated 130 wpm pace.
**Recommended Change:** Do a stopwatch read-through of Segment 1 alone (including realistic pause time for the hand-raises) and cut narration until it actually fits, or extend the segment's allotted time and rebalance the "cut rule" so this segment — not the Squad section — is first in line for trims if the whole pitch runs long.
**Expected Impact:** This is the highest-leverage 55 seconds in the pitch; if it runs long, it either cannibalizes the demo (the deck's best evidence) or forces a rushed, less confident cold open.
**Implementation Difficulty:** Low
**Priority:** Immediate

### 2. Clarify that "OneWave" is the platform's name, not a second brand

**Current State:** Segment 2 introduces "OneWave" with the same capitalized, branded treatment as "Chorus," but OneWave is actually the AI:GO benchmark platform's assigned name for the squad configuration — Chorus is the one product the team designed and branded. The pitch never states this distinction.
**Recommended Change:** Add a brief clause on first mention, e.g.: "So our squad — OneWave, the benchmark's name for it — is deliberately quiet..." This costs almost nothing in pacing and removes the only naming ambiguity in the pitch.
**Expected Impact:** Preempts the most likely naming-confusion question ("is this one product or two?") before a judge has to ask it — cheap insurance on a pitch that otherwise handles this well.
**Implementation Difficulty:** Low
**Priority:** Medium

### 3. Add a durability/moat sentence to the competitive positioning

**Current State:** Datadog, LangSmith, and Langfuse are now named, and Chorus is positioned as "the layer above" them — but nothing addresses what happens if one of them ships a narrated-replay feature next quarter.
**Recommended Change:** Add one clause on what compounds or doesn't transfer easily — e.g., schema-agnostic replay working across squads rather than one vendor's own logs, or a design philosophy those engineer-first tools are structurally unlikely to prioritize.
**Expected Impact:** Closes the single most predictable follow-up question from any judge who recognizes the named competitors, and is the difference between "good positioning" and "defensible positioning" on this framework's rubric.
**Implementation Difficulty:** Low
**Priority:** High

### 4. Add the two missing Q&A rows this review surfaced

**Current State:** The Q&A table covers eight questions, including two genuinely tough self-critical ones, but has no prepared line for "what stops [competitor] from copying this" or "is this one product or two projects."
**Recommended Change:** Add both rows now, using the answers already drafted in improvements #2 and #3 above, so they're rehearsed rather than improvised.
**Expected Impact:** These are the two most likely follow-ups given what's now in the body of the pitch; the rest of the Q&A table shows the team doesn't dodge hard questions, so leaving these two unprepared is inconsistent with the standard the rest of the appendix sets.
**Implementation Difficulty:** Low
**Priority:** High

### 5. Replace one top-down market stat with a bottom-up anchor, if time allows

**Current State:** Both market figures cited (agentic AI market, LLM observability market) are industry-wide TAM numbers with no SAM/SOM breakdown specific to "teams running multi-agent squads with a visibility gap."
**Recommended Change:** If the market segment has any spare seconds after improvement #1's trim elsewhere, swap one TAM figure for a single bottom-up anchor derived from data the team already has — e.g., a count from the hackathon's own leaderboard of how many distinct squads/teams are represented, framed as a proxy for "teams already building this way today."
**Expected Impact:** Moves the market section from "reasonable top-down sizing" to "sizing with at least one number we can defend from first principles," which is the single biggest lever left on the Market Sizing dimension score.
**Implementation Difficulty:** Medium (requires pulling a real number from available leaderboard data, not fabricating one)
**Priority:** Medium

---

## Judge Objection Predictions

*Reframed from "investor objection" to "judge objection" — this is a hackathon rubric context, not a funding decision, so severity below is read as "how likely to cost rubric points or credibility," not "how likely to kill a deal."*

### Objection 1: "Is this one product, or two hackathon projects sharing a narrative?"

**Category:** Execution Risk (naming clarity, not coherence — see correction below)
**Severity:** Low
**Trigger:** "OneWave" and "Chorus" are both introduced with the same capitalized, branded treatment in the script, but only Chorus is the team's actual product; OneWave is the AI:GO platform's assigned name for the squad configuration. A judge unaware of that distinction could mistake this for two separate team-branded efforts.
**Suggested Verbal Response:** This has an easy, true answer: "OneWave is the benchmark's name for our squad — Chorus is what we built, and it's designed to replay any squad's run, not just this one." That single sentence resolves the question completely; this is not a deep coherence problem, just an unstated fact.
**Deck Fix:** Improvement #2 above — add the clarifying clause on first mention of "OneWave" in Segment 2.

### Objection 2: "What stops Datadog or LangSmith from adding a narrated-replay view next quarter?"

**Category:** Competitive Risk
**Severity:** High
**Trigger:** The pitch now names these three competitors directly (a strength) but doesn't address feature-copy risk, which is the natural next question the moment real competitors are on the table.
**Suggested Verbal Response:** Emphasize that Chorus's value is in being schema-agnostic and audience-first by design, not a UI feature bolted onto an engineer-first product — those tools would need to rearchitect their audience assumption, not just add a view.
**Deck Fix:** Improvement #3 above.

### Objection 3: "Your market numbers are industry-wide TAM figures from paid research reports — how do you know any of that applies specifically to teams like the ones in this room?"

**Category:** Market Risk
**Severity:** Medium
**Trigger:** Market Sizing is top-down only with no SAM/SOM breakdown (see Dimension 3 detail).
**Suggested Verbal Response:** Acknowledge directly that these are industry-wide figures, and that the appendix already flags the cross-firm variance — then pivot to the qualitative point that's actually defensible without a bottom-up number: every team deploying agent squads generates the same kind of unreadable log, independent of exact market size.
**Deck Fix:** Improvement #5 above.

### Objection 4: "You claim Chorus works on 'any run of any squad' — have you tested it on a log your own team didn't generate?"

**Category:** Technical Risk
**Severity:** Medium
**Trigger:** The generalization claim ("any run of any squad replays this way") is stated confidently in Segment 3 but the document doesn't reference validation against a third-party or unfamiliar log.
**Suggested Verbal Response:** Be precise about what's actually verified — that Chorus is a pure function of the platform's fixed log schema (events + history), not of any particular squad's implementation — and be honest if cross-team testing hasn't happened yet.
**Deck Fix:** If cross-team validation exists, add it as a stat alongside the "27 public runs" data point in Segment 2; if it doesn't exist yet, soften "any run of any squad" to "any run that emits this schema" to keep the claim inside what's actually been verified — consistent with the document's own stated "no overclaiming" standard.

### Objection 5: "Your benchmark score is mid-table overall — why should a hackathon prize go to this over a team that scored higher across the board?"

**Category:** Capital Efficiency Risk (reframed: rubric-fit risk)
**Severity:** Low
**Trigger:** Segment 2 openly states the coding-track result is "tied for #1" while the doc's own Q&A table acknowledges the overall score is mid-table.
**Suggested Verbal Response:** Already well-handled in the existing Q&A table ("Benchmark is 40% of the rubric... the other 60%... is exactly what OneWave and Chorus were each designed for") — this is the one objection the team has already fully prepared for.
**Deck Fix:** None needed; flagging this as an example of what "prepared" looks like for the other objections above.

---

## Comparison to Successful Decks

*Standard caveat: the canonical decks below are fundraising instruments aimed at investors evaluating a venture-scale return, and this document is a judged-competition script with no ask — the comparison below is limited to narrative and evidentiary technique, not stage-appropriateness or fundraising structure, which don't transfer.*

### Primary Benchmark: Y Combinator standard (traction-first, demo-heavy, concise)

**Relevance:** The YC template rewards exactly the structure this pitch already uses — lead fast into proof, keep the demo front and center, stay under a tight slide/time count rather than padding with sections the stage doesn't need.

**Where This Deck is Stronger:**
- Most YC-style pitches state the problem; this one gets the room to physically demonstrate it, which is a more memorable proof of relevance than anything in a typical demo-day deck.
- The Q&A table's willingness to include self-critical questions (mid-table score, trailing math accuracy) goes beyond what most YC decks show; YC decks are usually reviewed by partners who already know the weak spots, whereas this pitch pre-empts them in writing.

**Where This Deck Falls Short:**
- YC-style pitches are ruthless about naming conventions staying legible under time pressure — this pitch introduces two capitalized names (OneWave, Chorus) with identical branded emphasis despite only one being the team's actual product, which costs a beat of avoidable clarification most YC-style pitches would strip out on a first pass.

**Techniques to Borrow:**
- YC decks that show a benchmark result alongside a product typically flag, in one clause, which is the platform's framing and which is the team's own — this is exactly the clause Improvement #2 recommends adding to Segment 2.

### Secondary Benchmark: Mixpanel (data-driven positioning, developer-focused GTM)

**Relevance:** Mixpanel's deck built credibility by leading with a specific, checkable statistical claim rather than a broad value proposition — structurally close to how Segment 2 opens with "0.275 vs 0.277" instead of a general claim about architecture.

**Where This Deck is Stronger:**
- The null-result framing ("statistically identical" — model choice doesn't decide the benchmark) is a sharper, more credible move than most data-led pitches make; showing a result that *doesn't* favor a default assumption is unusually disarming.

**Where This Deck Falls Short:**
- Mixpanel's data-driven positioning extended into its market sizing (grounded in developer/API usage patterns it could actually observe); this pitch's data discipline in Segment 2 doesn't carry through to Segment 4's market sizing, which reverts to citing external industry reports rather than data the team can observe directly (see Dimension 3).

**Techniques to Borrow:**
- Where Mixpanel sized its market from usage patterns it had direct visibility into, this team has direct visibility into the hackathon's own leaderboard — Improvement #5 suggests borrowing that same instinct (size from what you can see, not just what a report says) for at least one figure in Segment 4.

---

## Missing Slides or Sections

**Appropriately absent for this context (do not add):**
- Financial projections / unit economics — no fundraise, nothing to model
- Team bios / credentials slide — hackathon judges assess the team live, not from a slide
- Use-of-funds / Ask slide — there is no ask in a hackathon judging context

**Actually missing and worth considering:**
- An explicit "Why Now" beat — currently folded silently into the market section's growth-rate framing, but never stated as its own claim (e.g., why is this the year multi-agent squads and this specific trust gap became visible enough to matter, beyond "the market is growing")
- A written one-pager or leave-behind for judges who score offline after the room — this document is optimized entirely for the live 5 minutes, with nothing designed to be re-read later by a judge filling out a scorecard without the live demo in front of them
- The two Q&A rows identified in this review (competitive durability, and a ready line clarifying OneWave's naming origin)

---

## Appendix: Methodology

This review evaluates pitch decks across 8 weighted dimensions on a 1-10 scale, per the framework's standard methodology, then supplies a second, reweighted score across only the dimensions applicable to a judged hackathon pitch (see Calibration note). Market and growth figures referenced in the source document were verified via WebSearch earlier in this working session (MarketsandMarkets, Gartner, McKinsey, Research and Markets) and are documented with sources in the source document's own "Market data sources" appendix; this review did not re-verify them independently but did check that the citation trail is present and dated within the framework's 2-year freshness window. Design quality is noted but not scored, consistent with the framework, and is further limited here because the source document is a script with slide *descriptions* rather than the visual deck itself.
