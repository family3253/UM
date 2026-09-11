# PIVAS 智能用药助手 3.0 设计规格

## 目标

将现有 `v04/v05/v06/v08/v09-v24` 的增量脚本体系彻底重构为一个不依赖旧版本脚本的 **PIVAS Web Demo 3.0**。旧文件保留在仓库中作为回归基线，但 `pivas-demo/index.html` 在 3.0 发布后只加载新的 ES Modules。

## 技术路线

- 原生 HTML + CSS + ES Modules，不引入 React/Vite 和构建步骤。
- 保持静态 HTTPS 部署，可直接通过 raw.githack 演示。
- Tesseract.js 作为 OCR 后备；浏览器支持时优先使用 `BarcodeDetector` / `TextDetector`。
- localStorage 保存 PoC 级配置、草稿、历史和发布版本；不保存患者信息。
- 外部 AI 使用 OpenAI-compatible `/chat/completions` 接口，API 配置仅保存在本机浏览器。

## 目录结构

```text
pivas-demo/
├── index.html
├── app.css
├── js/
│   ├── app.js
│   ├── core/
│   │   ├── store.js
│   │   ├── events.js
│   │   └── router.js
│   ├── drugs/
│   │   ├── repository.js
│   │   ├── resolver.js
│   │   └── drug-card.js
│   ├── scan/
│   │   ├── camera.js
│   │   ├── ocr.js
│   │   └── scan-controller.js
│   ├── voice/
│   │   └── voice-search.js
│   ├── agent/
│   │   ├── qa-agent.js
│   │   ├── document-parser.js
│   │   ├── card-generator.js
│   │   └── evidence.js
│   ├── knowledge/
│   │   └── knowledge-service.js
│   └── ui/
│       └── views.js
├── data/
│   └── drugs.js
└── tests/
    ├── resolver.test.mjs
    ├── knowledge.test.mjs
    └── agent.test.mjs
```

## 统一数据模型

药品对象字段：

```js
{
  id,
  name,
  brand,
  en,
  strength,
  maker,
  aliases,
  image,
  prep,
  final,
  storage,
  infusion,
  warnings,
  source,
  version
}
```

所有扫描、语音、手动搜索都只调用同一个 `DrugResolver`；所有展示和 AI 问答都只读取同一个 `DrugRepository`。

## 核心流程

### 扫描

`Camera -> Barcode/Text/OCR -> 多帧 evidence -> DrugResolver -> confidence + margin -> DrugCard`

- 有码优先。
- 无码从第 3 个扫描周期后启动 OCR。
- OCR 不重叠运行。
- 多帧文字证据去重累计。
- 高置信度且与第二名差距足够时自动打开药卡；否则显示候选。

### 语音

`Web Speech -> transcript -> DrugResolver -> candidate -> DrugCard`

语音只是输入方式，不绕过药品品规确认。

### 一页药卡

首页药卡必须保持一屏速览导向：名称、商品名、规格、图片、复溶/稀释、终浓度、稳定性、输注/滤器、关键警示、来源和版本。关键操作词使用红色粗体，不使用火焰 emoji。

### AI 问答

`Current Drug Context -> local structured answer -> optional remote AI`

- 本地知识优先。
- 远端请求必须携带当前药品结构化上下文。
- 没有药品上下文时不得生成具体调配建议。

### AI 建卡

`PDF/TXT/MD -> text extraction/OCR -> LLM structured JSON -> evidence binding -> Draft -> pharmacist review -> publish -> DrugRepository`

证据政策：
- 上传说明书/院内资料为 primary evidence。
- 外部公开信息只能是 supplemental evidence。
- 外部证据不能单独授权发布。
- 缺少 primary evidence 阻止发布。
- 冲突字段必须进入人工审核。
- 发布前必须有药师审核动作。

## 必须保留的旧版功能

- 自动后置摄像头和前后摄像头切换
- BarcodeDetector
- TextDetector/Tesseract OCR
- 多帧 OCR evidence
- closed-set 模糊匹配
- confidence + margin 自动锁定
- 低置信度候选选择
- 六个药品卡
- 一页药卡、药品图片、红色粗体重点
- 手动搜索
- 语音搜药
- 当前药品 AI 问答
- API 设置
- PDF/TXT/MD 建卡
- AI 结构化抽取
- Draft/审核/发布
- 知识库历史与版本
- Pad/手机响应式布局

## 六个当前药品

- ATEZO
- BEVA_AVASTIN
- BEVA_DYT
- DARA
- DURVA
- BRENTUX_50

`BRENTUX_50` 必须为注射用维布妥昔单抗（安适利® / ADCETRIS®，50 mg/瓶），不得重新引入旧的阿昔洛韦错误条目。

## 临床安全边界

当前数据为 Demo 转录/结构化示范，发布界面必须保留“需依据当前批准说明书和院内规则复核”的提示。系统不得将 AI 自动输出直接作为已审核临床指令。

## 发布验收

3.0 发布前必须满足：

1. `index.html` 不再加载任何 `v0x/v1x/v2x` 旧脚本。
2. 三个核心单元测试（resolver/knowledge/agent）通过。
3. ES module 静态语法检查通过。
4. 6 个药品均可由 repository 读取。
5. `维布妥昔单抗/安适利/ADCETRIS/Brentuximab/50mg` 能解析为 `BRENTUX_50`。
6. 未审核草稿不能发布。
7. AI 问答无上下文时返回先选择药品，而不是生成答案。
8. GitHub `pivas-https-demo` 最终指向已验证 3.0 commit，raw.githack 使用相同 `index.html`。