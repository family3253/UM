# PIVAS 智能用药助手 3.0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有增量脚本体系重构为一个不依赖旧版脚本、可直接静态部署的 PIVAS Web Demo 3.0。

**Architecture:** 采用原生 HTML/CSS/ES Modules。所有识别入口统一进入 `DrugResolver`，所有药品内容统一由 `DrugRepository` 提供；AI 建卡与知识库审核发布独立于扫描运行时，通过明确接口向 repository 提供已审核版本。

**Tech Stack:** HTML5, CSS3, ES Modules, Web Speech API, MediaDevices, BarcodeDetector/TextDetector（若支持）, Tesseract.js, localStorage, OpenAI-compatible chat completions.

**Spec:** `docs/superpowers/specs/2026-09-11-pivas-v3-design.md`

## Global Constraints

- `pivas-demo/index.html` 的 3.0 运行时不得加载任何 `v0x/v1x/v2x` 旧脚本。
- 不引入 React/Vite 或必须构建的前端工具链。
- 保留六个药品与 `BRENTUX_50` 正确身份，不重新引入阿昔洛韦错误。
- 外部 AI 输出只能形成 Draft；无 primary evidence、存在冲突或未经药师审核时不得发布。
- 不保存患者信息。
- 先在 `pivas-v3-rebuild` 隔离分支实现和验证，最终才推进 `pivas-https-demo`。

---

### Task 1: 3.0 数据层与 Resolver

**Files:**
- Create: `pivas-demo/data/drugs.js`
- Create: `pivas-demo/js/drugs/repository.js`
- Create: `pivas-demo/js/drugs/resolver.js`
- Test: `pivas-demo/tests/resolver.test.mjs`

**Interfaces:**
- `DrugRepository.list(): Drug[]`
- `DrugRepository.get(id: string): Drug|null`
- `DrugRepository.upsert(drug: Drug): Drug`
- `DrugResolver.resolve(text: string): {drug: Drug, score: number}[]`

- [ ] Write failing tests for six-drug loading and Brentuximab aliases.
- [ ] Run `node pivas-demo/tests/resolver.test.mjs` and confirm failure before implementation.
- [ ] Implement normalized drug dataset, repository and closed-set fuzzy resolver.
- [ ] Re-run test and confirm all assertions pass.
- [ ] Commit task.

### Task 2: Core Store, Events and Router

**Files:**
- Create: `pivas-demo/js/core/store.js`
- Create: `pivas-demo/js/core/events.js`
- Create: `pivas-demo/js/core/router.js`

**Interfaces:**
- `Store.get/set/readJson/writeJson`
- `Events.emit/on`
- `Router.go(viewId)`

- [ ] Add minimal smoke assertions to existing tests for storage namespace and event API.
- [ ] Verify failure before implementation.
- [ ] Implement the three small modules.
- [ ] Run all tests.
- [ ] Commit task.

### Task 3: Knowledge Draft/Review/Publish

**Files:**
- Create: `pivas-demo/js/knowledge/knowledge-service.js`
- Test: `pivas-demo/tests/knowledge.test.mjs`

**Interfaces:**
- `KnowledgeService.createDraft(payload)`
- `KnowledgeService.review(id, {approved, reviewer})`
- `KnowledgeService.publish(id)`
- `KnowledgeService.listDrafts()`
- `KnowledgeService.listPublished()`

- [ ] Write failing tests: draft cannot publish before approval; rejected draft cannot publish; approved draft can publish and receives version metadata.
- [ ] Run and confirm expected failures.
- [ ] Implement localStorage-backed service with evidence/publish gates.
- [ ] Run tests and confirm pass.
- [ ] Commit task.

### Task 4: Local Drug QA Agent and Evidence Policy

**Files:**
- Create: `pivas-demo/js/agent/evidence.js`
- Create: `pivas-demo/js/agent/qa-agent.js`
- Test: `pivas-demo/tests/agent.test.mjs`

**Interfaces:**
- `Evidence.validateDraft(draft)`
- `QAAgent.setDrug(drug|null)`
- `QAAgent.askLocal(question): string`
- `QAAgent.ask(question, config): Promise<string>`

- [ ] Write failing tests for no-context response and prep/storage/infusion/warnings routing.
- [ ] Run and confirm failure.
- [ ] Implement evidence rules and local-first Q&A.
- [ ] Add optional OpenAI-compatible remote call only when local answer is insufficient and API is enabled.
- [ ] Run tests and confirm pass.
- [ ] Commit task.

### Task 5: Camera/OCR/Scan Controller

**Files:**
- Create: `pivas-demo/js/scan/camera.js`
- Create: `pivas-demo/js/scan/ocr.js`
- Create: `pivas-demo/js/scan/scan-controller.js`

**Interfaces:**
- `Camera.start(video, facingMode)` / `switch()` / `stop()`
- `OCR.recognize(canvas): Promise<string>`
- `ScanController.start(video, callbacks)` / `stop()` / `processText(text)`

- [ ] Add resolver-level failing assertions for confidence and margin auto-lock decisions.
- [ ] Run tests and confirm failure.
- [ ] Implement camera management with remembered front/back setting.
- [ ] Implement BarcodeDetector first, then TextDetector/Tesseract OCR, with single-flight OCR and multi-frame evidence.
- [ ] Implement confidence + margin auto-open and candidate fallback.
- [ ] Run tests plus `node --check` on scan modules.
- [ ] Commit task.

### Task 6: Voice Search

**Files:**
- Create: `pivas-demo/js/voice/voice-search.js`

**Interfaces:**
- `VoiceSearch.start({onText,onCandidates,onError})`
- Uses `DrugResolver.resolve(transcript)` only.

- [ ] Add a transcript-to-resolver assertion in resolver tests.
- [ ] Confirm test fails if voice normalization expectation is absent.
- [ ] Implement Web Speech wrapper with graceful unsupported-browser fallback.
- [ ] Run tests and static syntax check.
- [ ] Commit task.

### Task 7: Document Parser and AI Card Generator

**Files:**
- Create: `pivas-demo/js/agent/document-parser.js`
- Create: `pivas-demo/js/agent/card-generator.js`

**Interfaces:**
- `DocumentParser.parse(file): Promise<{text,pages,source}>`
- `CardGenerator.generate(parsed, metadata, apiConfig): Promise<DraftPayload>`

- [ ] Add evidence validation tests for missing primary evidence and source conflicts.
- [ ] Run and confirm failure.
- [ ] Implement TXT/MD text reading, PDF text extraction path, OCR fallback hook and explicit unsupported/error states.
- [ ] Implement strict JSON extraction prompt for fields `prep/final/storage/infusion/warnings/evidence`.
- [ ] Ensure output is Draft only and never auto-published.
- [ ] Run tests/static checks.
- [ ] Commit task.

### Task 8: Unified UI and One-Page Drug Card

**Files:**
- Create: `pivas-demo/js/ui/views.js`
- Create: `pivas-demo/js/drugs/drug-card.js`
- Create: `pivas-demo/app.css`

**Interfaces:**
- `Views.mount(root, services)`
- `DrugCard.render(drug)`

- [ ] Build home views for Scan, Search, Voice, AI Builder, Knowledge, Settings and History.
- [ ] Preserve one-viewport quick card and red-bold critical terms.
- [ ] Wire scan/voice/search success to one shared `openDrug(id)` action and synchronize QA context.
- [ ] Add responsive Pad/mobile CSS.
- [ ] Run static checks.
- [ ] Commit task.

### Task 9: 3.0 App Entrypoint and Legacy Independence

**Files:**
- Create: `pivas-demo/js/app.js`
- Replace: `pivas-demo/index.html`

**Interfaces:**
- `app.js` creates repositories/services and mounts UI.

- [ ] Write a static verification script/assertion that `index.html` contains `type="module"` and contains no `v05`, `v06`, `v08`, `v1`, `v2` runtime script references.
- [ ] Run and confirm the current pre-3.0 entry would fail that assertion.
- [ ] Replace index with clean 3.0 HTML loading only `app.css`, Tesseract dependency, and `js/app.js` as module.
- [ ] Run all unit/static tests.
- [ ] Commit task.

### Task 10: Promotion to Deployment Branch

**Files:**
- No new source files; promotion only after verification.

- [ ] Fetch `pivas-v3-rebuild` head and verify changed tree contains 3.0 entry/modules/tests/docs.
- [ ] Run local mirrored tests: resolver, knowledge, agent, static index check, and `node --check` for all new JS modules.
- [ ] Verify six drugs and `BRENTUX_50` alias cases.
- [ ] Move `pivas-https-demo` ref to the verified 3.0 commit.
- [ ] Fetch `pivas-demo/index.html` from `pivas-https-demo` and confirm title/version = 3.0 and no legacy runtime references.
- [ ] Provide raw.githack deployment URL and state browser-only E2E limitations explicitly.