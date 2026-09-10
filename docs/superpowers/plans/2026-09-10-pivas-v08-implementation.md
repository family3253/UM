# PIVAS v0.8 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the Web Demo closer to the approved v0.8 spec and synchronize both v1.1 project-plan documents.

**Architecture:** Keep the existing v0.5 base data and v0.6/v0.7 enhancement layers stable, then add a separate v0.8 interaction layer for voice search, draft/review/publish, history and settings. Keep all clinical lookup deterministic/local-first; voice is only an input method and AI-generated knowledge remains Draft until review.

**Tech Stack:** Static HTML/CSS/JavaScript, Web Speech API feature detection, localStorage, existing Drug Resolver, python-docx for plan updates.

**Spec:** `docs/superpowers/specs/2026-09-10-pivas-demo-v08-and-plan-v11-design.md`

## Global Constraints
- No patient identifiers or HIS/PIVAS patient data.
- Six current drug cards remain one-screen-first with product images and red+bold safety-critical terms.
- Responsive phone/Pad/desktop sizing remains enabled.
- Voice search must route through the existing deterministic Drug Resolver.
- AI card generation must remain Draft → Review → Publish.
- Default deployment must point to v0.8.

### Task 1: v0.8 interaction layer
- [x] Add homepage voice-search, card-builder/review and history entry points.
- [x] Implement Web Speech feature detection, transcript display and Drug Resolver routing.
- [x] Add localStorage history with no patient data.
- [x] Add Draft/Review/Publish PoC with source-confirmation gate.
- [x] Extend API settings with temperature, timeout, enable toggle and vision-fallback toggle.
- [x] Run JavaScript syntax and feature-presence checks.

### Task 2: responsive styling
- [x] Preserve v0.7 responsive one-page drug cards.
- [x] Add v0.8 voice/builder/history responsive CSS.

### Task 3: synchronize project plans
- [x] Upgrade both plan documents to v1.1.
- [x] Add v1.1 requirements and Web PoC vs Android production capability matrix.
- [x] Render both DOCX files and visually review every page via contact sheets.

### Task 4: deployment
- [x] Create versioned `pivas-demo/v08.html`.
- [x] Update `pivas-demo/index.html` to load v0.8.
- [x] Re-fetch remote index and v0.8 JS to verify deployed content.
