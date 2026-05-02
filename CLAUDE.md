# Tavern Helper Template — 酒馆助手前端界面/脚本编写

用于编写酒馆助手 (Tavern Helper) 前端界面和脚本的模板，产物以 iframe 形式在 SillyTavern 中运行。

## Commands

- `pnpm watch` — 开发监听（含 socket.io 热重载到酒馆、schema dump、tavern_sync）
- `pnpm build:dev` — 开发构建（代码可读、未混淆）
- `pnpm build` — 生产构建（代码混淆压缩）
- `pnpm lint` / `pnpm lint:fix` — ESLint
- `pnpm format` — Prettier 格式化
- `pnpm dump` — 将 `schema.ts` 转为 `schema.json`
- `pnpm sync` — tavern_sync 打包角色卡/世界书/预设

## Architecture

每个前端界面或脚本都是 `src/` 中的一个独立文件夹：

- 仅有 `index.ts` → **脚本项目**（后台 iframe，无界面）
- 同时有 `index.ts` + `index.html` → **前端界面项目**（前台 iframe，有界面）
- `初始模板/` 下有脚本、前端界面、流式楼层界面、角色卡的模板
- `示例/` 下有示例项目（不要删除，AI 需要参考其中的代码）
- 构建 `src/{示例,src}/**/index.{ts,tsx,js,jsx}` → `dist/`

`@types/` 定义了酒馆助手全部可用接口，代码中**直接调用即可，无需导入**。

`util/` 提供工具函数：`common.ts`（通用）、`script.ts`（脚本专用）、`mvu.ts`（MVU 角色卡专用）、`streaming.ts`（流式楼层界面）。

Path aliases: `@/` → `./src/`，`@util/` → `./util/`

## Critical Conventions

### 加载/卸载时机

- ✅ 用 `$(() => { ... })` 作为加载执行时机
- ❌ **禁止** `DOMContentLoaded`（加载方式不触发该事件）
- ✅ 用 `$(window).on('pagehide', ...)` 作为卸载时机
- ❌ 不要用 `unload`

### 全局可用变量（无需导入）

`$`(jQuery)、`_`(lodash)、`toastr`、`SillyTavern`、`Vue`、`VueRouter`、`YAML`、`z`(zod)、`showdown` — 这些在 webpack 中被 externals 映射为全局变量，运行时从酒馆页面获取。

### 前端界面 iframe 适配

- 禁止使用 `vh` 等受宿主高度影响的单位，用 `width` + `aspect-ratio`
- 主体内容禁止 `position: absolute` 等脱离文档流的样式
- 适配容器宽度，不产生横向滚动条
- 如果样式更适合卡片形状则不要有背景颜色（除非用户要求）

### index.html 规则

- `<head>` 保持空白，webpack 会注入样式和脚本
- 禁止 `<link>` `<script>` 标签引入本地资源
- 禁止 `<img src="">` 空占位

### 脚本中 jQuery 的作用域

脚本中 `$` 指向 `window.parent.$`，作用于整个酒馆页面而非 iframe 自身。使用 `createScriptIdDiv()` 或 `createScriptIdIframe()` 创建挂载点。

### 脚本挂载 Vue 组件的样式问题

- 挂载到酒馆网页 DOM → 用 `teleportStyle()` 复制样式到 `<head>`，**禁止使用 tailwindcss**（类名冲突）
- 挂载到 iframe DOM → 用 `createScriptIdIframe()` + `teleportStyle(iframe.contentDocument.head)`，**优先使用 tailwindcss**

### 特殊导入语法

```ts
import html from './file.html'         // html-loader 最小化后导入
import content from './file?raw'       // 原始内容（.ts/.scss 经 webpack 处理）
import md from './file.md'             // remark-loader 解析为 HTML
import Component from './file.vue'     // Vue 组件（支持 pinia、vue-router）
```

### Vue 相关

- vue-router 必须用 `createMemoryHistory()`，不能用 `createWebHistory()`
- `createRouter()` 不能写在 `$(() => {})` 中，必须在全局执行
- 存储响应式数据到酒馆变量前用 `klona()` 去除 proxy: `replaceVariables(klona(settings.value), ...)`
- 用 pinia + zod 管理数据状态，参考 `util/mvu.ts` 中的 `defineMvuDataStore`

### 优先使用的技术栈

- 界面框架: Vue > jQuery > 原生 DOM
- 样式: tailwindcss > `<style scoped>` > 其他
- 动画: gsap
- 数据校验: zod 4（不是 zod 3），用 `z.prettifyError()` 或 `prettifyErrorWithInput()` 格式化错误
- DOM 操作: jQuery > 原生
- 拖动: jQuery UI

### 优先使用酒馆助手接口

`@types/function/` 中 `chat_message`、`worldbook`、`variables` 等接口优先于 `@types/iframe/exported.sillytavern.d.ts` 中的底层接口和 STScript 命令。

### MVU 角色卡

- 代码顶部必须 `await waitGlobalInitialized('Mvu')`
- 前端界面还需 `await waitUntil(() => _.has(getVariables({type: 'message'}), 'stat_data'))`
- 变量结构用 zod 4 定义在 `schema.ts` 中
- 用 `defineMvuDataStore` (from `@util/mvu`) 创建 pinia store

## Build & CI Notes

- `dist/` 冲突通过 `.gitattributes` 用 ours 策略自动解决，首次克隆需 `git config --global merge.ours.driver true`
- 入口文件含 `@obfuscate` 注释时生产构建会启用代码混淆
- 入口文件含 `@no-ci` 注释时 CI 跳过该入口的构建
- `pnpm watch` 启动 socket.io 端口 6621 推送热重载事件，需在酒馆助手中启用"实时监听-允许监听"
- webpack externals: 大部分 npm 包运行时从 jsdelivr CDN 加载
- 可通过 chrome-devtools MCP 连接已打开的浏览器来调试酒馆网页

## Knowledge Base / 知识库

编写角色卡（包括 MVU 角色卡、世界书、前端界面、脚本等）时，必须优先参考 `知识库/写卡知识库/` 中的内容：

- `00_索引.md` / `目录.md` — 知识库总索引和目录
- `20_19_角色卡管理.md` / `10_09_角色卡信息.md` — 角色卡管理和信息
- `21_世界书配置指南.md` / `04_03_世界书操作.md` — 世界书配置和操作

知识库内容优先于其他来源，如有矛盾以知识库为准。

## Domain References

详细领域知识见 `.cursor/rules/` 下的 mdc 文件：

- `项目基本概念.mdc` — 项目结构、导入方式、最佳实践
- `前端界面.mdc` — 前端界面 index.html 规则、图标、iframe 适配
- `脚本.mdc` — 脚本 jQuery 作用域、Vue 挂载、按钮、设置
- `酒馆助手接口.mdc` — @types 各文件功能说明
- `酒馆变量.mdc` — 变量类型说明
- `mvu变量框架.mdc` — MVU 事件、数据存储、parseMessage
- `mvu角色卡.mdc` — MVU 角色卡文件夹结构、schema 规则
- `mcp.mdc` — chrome-devtools MCP 调试说明
