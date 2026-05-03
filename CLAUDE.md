# Tavern Helper Template

酒馆助手前端界面/脚本编写模板，产物以 iframe 形式在 SillyTavern 中运行。

## 项目类型识别 — 先看这里

根据 `src/` 下项目文件夹中的文件来判断类型，**只读对应部分，跳过无关内容**：

| 项目特征                     | 类型         | 阅读: 通用 +       |
| ---------------------------- | ------------ | ------------------ |
| 仅有 `index.yaml`，无 `.ts`  | 纯文字角色卡 | 纯文字角色卡       |
| 有 `schema.ts` + MVU         | MVU 角色卡   | 纯文字 + MVU 角色卡 |
| `index.ts` + `index.html`    | 前端界面     | 前端界面           |
| 仅有 `index.ts`              | 脚本         | 脚本               |

> **重要**: 纯文字角色卡不需要读 MVU、前端界面、脚本相关的内容。

## Commands

- `pnpm watch` — 开发监听（含 socket.io 热重载到酒馆、schema dump、tavern_sync）
- `pnpm build:dev` — 开发构建（代码可读、未混淆）
- `pnpm build` — 生产构建（代码混淆压缩）
- `pnpm lint` / `pnpm lint:fix` — ESLint
- `pnpm format` — Prettier 格式化
- `pnpm dump` — 将 `schema.ts` 转为 `schema.json`
- `pnpm sync` — tavern_sync 打包角色卡/世界书/预设

## 所有项目通用

Path aliases: `@/` → `./src/`，`@util/` → `./util/`

`@types/` 定义了酒馆助手全部可用接口，代码中**直接调用即可，无需导入**。

`util/` 提供工具函数：`common.ts`（通用）、`script.ts`（脚本专用）、`mvu.ts`（MVU 专用）、`streaming.ts`（流式楼层界面）。

### 加载/卸载时机

- ✅ 用 `$(() => { ... })` 作为加载执行时机
- ❌ **禁止** `DOMContentLoaded`（加载方式不触发该事件）
- ✅ 用 `$(window).on('pagehide', ...)` 作为卸载时机
- ❌ 不要用 `unload`

### 全局可用变量（无需导入）

`$`(jQuery)、`_`(lodash)、`toastr`、`SillyTavern`、`Vue`、`VueRouter`、`YAML`、`z`(zod)、`showdown` — 这些在 webpack 中被 externals 映射为全局变量，运行时从酒馆页面获取。

### 特殊导入语法

```ts
import html from './file.html'         // html-loader 最小化后导入
import content from './file?raw'       // 原始内容（.ts/.scss 经 webpack 处理）
import md from './file.md'             // remark-loader 解析为 HTML
import Component from './file.vue'     // Vue 组件（支持 pinia、vue-router）
```

### 优先使用的技术栈

- 界面框架: Vue > jQuery > 原生 DOM
- 样式: tailwindcss > `<style scoped>` > 其他
- 动画: gsap
- 数据校验: zod 4（不是 zod 3），用 `z.prettifyError()` 或 `prettifyErrorWithInput()` 格式化错误
- DOM 操作: jQuery > 原生
- 拖动: jQuery UI

### 优先使用酒馆助手接口

`@types/function/` 中 `chat_message`、`worldbook`、`variables`、`character`、`lorebook` 等接口优先于 `@types/iframe/exported.sillytavern.d.ts` 中的底层接口和 STScript 命令。

### Build & CI

- `dist/` 冲突通过 `.gitattributes` 用 ours 策略自动解决，首次克隆需 `git config --global merge.ours.driver true`
- 入口文件含 `@obfuscate` 注释时生产构建会启用代码混淆
- 入口文件含 `@no-ci` 注释时 CI 跳过该入口的构建
- `pnpm watch` 启动 socket.io 端口 6621 推送热重载事件，需在酒馆助手中启用"实时监听-允许监听"
- webpack externals: 大部分 npm 包运行时从 jsdelivr CDN 加载
- 可通过 chrome-devtools MCP 连接已打开的浏览器来调试酒馆网页
- `tavern_sync.mjs` 是预构建的工具，**不要修改**
- `tailwind.css` **仅供语法高亮**，实际 tailwind 通过 postcss 插件配置，不要在代码中引用这个文件

### 生成文件

- `auto-imports.d.ts` / `auto-imports.zod.d.ts` / `components.d.ts` 由 webpack 自动生成，在 `.gitignore` 中，不要手动编辑或提交

### TypeScript 严格模式注意

`tsconfig.json` 设置了 `noUnusedLocals: true` / `noUnusedParameters: true`，IDE 会报 unused 错误。但 `webpack.config.ts` 中 ts-loader 覆盖为 `false`，所以构建不会因此失败。修复 unused 问题时应信任 IDE 提示，但无需特意清理所有未使用导入。

---

## 纯文字角色卡

**特征**: `index.yaml`，可能有 `世界书/`、`第一条消息/` 等，无 `.ts` 文件。
**产物**: 通过 `pnpm sync` 打包为酒馆可导入的角色卡文件。

### 推荐阅读

**知识库** (`知识库/写卡知识库/`)：
- `20_19_角色卡管理.md` / `10_09_角色卡信息.md` — 角色卡管理和信息
- `21_世界书配置指南.md` / `04_03_世界书操作.md` — 世界书配置和操作
- `02_01_消息楼层操作.md` — 消息楼层相关接口

**`.cursor/rules/`**：
- `酒馆助手接口.mdc` — @types 各文件功能说明
- `酒馆变量.mdc` — 变量类型说明

### 重点使用的 @types 接口

- `worldbook` / `lorebook` / `lorebook_entry` — 世界书读写
- `character` / `raw_character` — 角色卡信息
- `chat_message` — 消息楼层操作
- `variables` — 酒馆变量读写
- `builtin` — 内置工具函数

---

## MVU 角色卡

**特征**: 在纯文字角色卡基础上增加了 `schema.ts`、MVU 框架。
**产物**: 角色卡 + MVU 脚本/前端界面。

### 在纯文字角色卡基础上额外需要

**代码约定**:
- 代码顶部必须 `await waitGlobalInitialized('Mvu')`
- 变量结构用 zod 4 定义在 `schema.ts` 中
- 用 `defineMvuDataStore` (from `@util/mvu`) 创建 pinia store

**知识库** (`知识库/写卡知识库/`)：
- `17_16_MVU变量框架.md` — MVU 事件、数据存储、parseMessage
- `30_MVU_ZOD指南.md` — MVU 中 zod 使用指南
- `27_MVU自查.md` / `26_MVU前端状态栏自查.md` — MVU 自查清单

**`.cursor/rules/`**：
- `mvu变量框架.mdc` — MVU 事件、数据存储、parseMessage
- `mvu角色卡.mdc` — MVU 角色卡文件夹结构、schema 规则

### Vue 相关（MVU / 前端界面 / 脚本均适用）

- vue-router 必须用 `createMemoryHistory()`，不能用 `createWebHistory()`
- `createRouter()` 不能写在 `$(() => {})` 中，必须在全局执行
- 存储响应式数据到酒馆变量前用 `klona()` 去除 proxy: `replaceVariables(klona(settings.value), ...)`
- 用 pinia + zod 管理数据状态，参考 `util/mvu.ts` 中的 `defineMvuDataStore`

---

## 前端界面

**特征**: `index.ts` + `index.html`。
**产物**: 前台 iframe，有 UI 界面。

### 推荐阅读

**`.cursor/rules/`**：
- `前端界面.mdc` — index.html 规则、图标、iframe 适配

### 代码约定

**index.html 规则**:
- `<head>` 保持空白，webpack 会注入样式和脚本
- 禁止 `<link>` `<script>` 标签引入本地资源
- 禁止 `<img src="">` 空占位

**iframe 适配**:
- 禁止使用 `vh` 等受宿主高度影响的单位，用 `width` + `aspect-ratio`
- 主体内容禁止 `position: absolute` 等脱离文档流的样式
- 适配容器宽度，不产生横向滚动条
- 如果样式更适合卡片形状则不要有背景颜色（除非用户要求）

**Vue 相关**: 见上方「Vue 相关」部分。

---

## 脚本

**特征**: 仅有 `index.ts`，`@types/`中的接口**直接使用无需导入**。
**产物**: 后台 iframe，无可见界面。

### 推荐阅读

**`.cursor/rules/`**：
- `脚本.mdc` — jQuery 作用域、Vue 挂载、按钮、设置

### 代码约定

**jQuery 作用域**: 脚本中 `$` 指向 `window.parent.$`，作用于整个酒馆页面而非 iframe 自身。使用 `createScriptIdDiv()` 或 `createScriptIdIframe()` 创建挂载点。

**Vue 样式挂载**:
- 挂载到酒馆网页 DOM → 用 `teleportStyle()` 复制样式到 `<head>`，**禁止使用 tailwindcss**（类名冲突）
- 挂载到 iframe DOM → 用 `createScriptIdIframe()` + `teleportStyle(iframe.contentDocument.head)`，**优先使用 tailwindcss**

**Vue 相关**: 见上方「Vue 相关」部分。

---

## 参考索引

### 知识库 (`知识库/写卡知识库/`)

| 文件                          | 内容           | 纯文字 | MVU |
| ----------------------------- | -------------- | :----: | :-: |
| `00_索引.md` / `目录.md`      | 知识库总索引   |   ✅   | ✅  |
| `20_19_角色卡管理.md`         | 角色卡管理     |   ✅   | ✅  |
| `10_09_角色卡信息.md`         | 角色卡信息     |   ✅   | ✅  |
| `21_世界书配置指南.md`        | 世界书配置     |   ✅   | ✅  |
| `04_03_世界书操作.md`         | 世界书操作     |   ✅   | ✅  |
| `02_01_消息楼层操作.md`       | 消息楼层操作   |   ✅   | ✅  |
| `17_16_MVU变量框架.md`        | MVU 框架       |        | ✅  |
| `30_MVU_ZOD指南.md`           | MVU Zod 指南   |        | ✅  |
| `27_MVU自查.md`               | MVU 自查       |        | ✅  |
| `26_MVU前端状态栏自查.md`     | MVU 状态栏     |        | ✅  |

### .cursor/rules

| 文件                    | 内容                     | 纯文字 | MVU | 前端界面 | 脚本 |
| ----------------------- | ------------------------ | :----: | :-: | :------: | :--: |
| `项目基本概念.mdc`      | 项目结构、导入、最佳实践 |   ✅   | ✅  |    ✅    |  ✅  |
| `酒馆助手接口.mdc`      | @types 文件功能说明      |   ✅   | ✅  |    ✅    |  ✅  |
| `酒馆变量.mdc`          | 变量类型说明             |   ✅   | ✅  |    ✅    |  ✅  |
| `mvu变量框架.mdc`       | MVU 事件、存储           |        | ✅  |          |      |
| `mvu角色卡.mdc`         | MVU 文件夹结构           |        | ✅  |          |      |
| `前端界面.mdc`          | HTML 规则、iframe 适配   |        |     |    ✅    |      |
| `脚本.mdc`              | jQuery 作用域、Vue 挂载  |        |     |          |  ✅  |
| `mcp.mdc`               | chrome-devtools 调试     |   ✅   | ✅  |    ✅    |  ✅  |
