# 酒馆助手前端界面或脚本编写

@.cursor/rules/项目基本概念.mdc
@.cursor/rules/mcp.mdc
@.cursor/rules/酒馆变量.mdc
@.cursor/rules/酒馆助手接口.mdc
@.cursor/rules/前端界面.mdc
@.cursor/rules/脚本.mdc
@.cursor/rules/mvu变量框架.mdc
@.cursor/rules/mvu角色卡.mdc

## 构建与开发

- **包管理器**: pnpm (锁文件 `pnpm-lock.yaml`), 优先使用 Node 24.
- **监听 / 热重载**: `pnpm watch`. 以开发模式运行 webpack + 在 6621 端口启动 socket.io 服务器，向酒馆页面推送重载事件.
- **生产构建**: `pnpm build` (由 CI 自动提交 `dist/`; 见下文).
- **格式化**: `pnpm format` (Prettier).
- **代码检查**: `pnpm lint` / `pnpm lint:fix` (ESLint; ts-loader 中已禁用 noUnusedLocals/unusedParameters，因此 lint 是实际门槛).

## 项目结构

- 每个子项目都是 `src/` 下的独立文件夹 (`示例/` 中是示例项目).
- **前端界面**: 文件夹包含 `index.ts` + `index.html`.
- **脚本**: 文件夹只包含 `index.ts`.
- **角色卡**: 通常是纯文字内容 (见下节); 只有需要状态栏/变量系统时才叠加代码.
- Webpack 通过 `{示例,src}/**/index.{ts,tsx,js,jsx}` 自动发现入口.
- `dist/` 已加入版本控制，由 CI 在推送时自动重建. 本地 `dist/` 内容不需要完美.

## 知识库

- `知识库/` 用于存放项目注意事项、检查清单、写作规范等非代码类内容.
- **写作**: `知识库/写作/` 下存放角色卡/世界书质检标准、文风要求等. AI 在生成或修改文字内容后**必须**对照该目录下的标准进行自查，禁止不检查就直接声称完成。
- **开发**: `知识库/开发/` 下存放编码规范、架构约定等 (如有).
- 相关规则见 `.cursor/rules/知识库引用.mdc`.

## 角色卡类型区分

项目中会出现的角色卡/世界书大致分以下几类，**不要默认所有角色卡都需要写代码**:

| 类型 | 典型内容 | 是否需要代码 |
|------|---------|-------------|
| **纯文字角色卡** | `index.yaml` + `世界书/*.yaml` + `第一条消息/*.txt` + `头像.png` 等 | **不需要**. 没有任何脚本、前端界面、schema |
| **独立世界书** | `index.yaml` + 多条世界书条目 (如 `图生提示词世界书`) | **不需要** |
| **MVU 角色卡** | 纯文字内容 + `脚本/` + `界面/` + `schema.ts` | 需要代码，参考 `mvu角色卡.mdc` 和 `mvu变量框架.mdc` |
| **独立脚本 / 前端界面** | `src/xxx/index.ts` (± `index.html`) | 纯代码项目，不绑定角色卡 |

- 如果用户只说"写一张角色卡"或"写一组世界书条目"，默认按**纯文字角色卡**处理，不要引入 MVU、状态栏或脚本.
- 只有当用户明确提到"状态栏""MVU 变量""前端界面""脚本"等关键词时，才需要参考 MVU 相关的 `.cursor/rules/*.mdc` 文件.

## 写作规范

- 任何角色卡、世界书、第一条消息等**文字内容**的创作或修改，完成后必须对照 `知识库/写作/通用写作规范.md` 进行自查。自查重点：
  - 八股化检查：破折号 `——`、极端词（极度/万分/无比/深深的）、否定转折（不是…而是…）、模糊词（似乎/仿佛/如同/宛如/好像）、陈旧比喻（像小兽/小兔子/投石入湖/心湖泛起涟漪）、八股微表情（嘴角上扬/眼中闪过一丝/指尖泛白）、语气声线标签（带着xx的口吻/用xx的语气）
  - 白描原则：精简无意义形容词、删除主观评价、用具体行为代替抽象描述
  - 具体性检查：抽象描述→具体行为、笼统表述→具体细节
- `知识库/写作/角色卡质检.md` 提供角色卡专项审查标准（外貌差异化、绝对零度原则、语料纯净度、三面性/二次解释/NSFW调色盘的真实感检查）。
- 质检通过标志：对修改过的文件运行 `rg` 命令检查违例词后无匹配。
- **禁止**在创作后不做自查就直接声称完成。

## 代码规范

- 使用 `$(() => { ... })` 进行加载/初始化. **禁止**使用 `DOMContentLoaded`.
- 使用 `$(window).on('pagehide', ...)` 进行清理，不要使用 `unload`.
- iframe 内的 vue-router **必须**使用 `createMemoryHistory()`.
- 脚本在 iframe 中运行，但 jQuery (`$`) 代理到父级酒馆页面 (`window.parent.$`).
- 当从脚本向酒馆页面挂载 Vue 组件时，调用 `util/script.ts` 中的 `teleportStyle()` 以确保样式生效；如需样式隔离，使用 `createScriptIdIframe()`.
- 前端界面支持 `import './foo.scss'`; 样式会被内联到最终 HTML 的 `<head>` 中.
- `import foo from './file?raw'` 将文件内容作为字符串导入. 对于 `.ts`/`.scss`，导入的是编译后的 JS/CSS，而非原始源码.
- `import html from './file.html'` 使用 html-loader (最小化后的字符串).
- `import md from './file.md'` 使用 remark-loader (转换为 HTML 字符串).
- Tailwind CSS v4 全局可用；`tailwind.css` 仅用于 IDE 语法高亮 (不要导入它).

## Schema 导出

- `src/**/schema.ts` 文件在 `pnpm build` / `pnpm watch` 期间被处理，输出为同目录的 `schema.json`.
- `pnpm dump` 可手动运行此过程.

## 酒馆同步 (角色卡 / 世界书打包)

- 配置在 `tavern_sync.yaml` 中. 每个条目将本地 `src/.../index` 路径映射到 `成品/` 中的输出.
- `pnpm sync bundle all` 一次性打包所有已配置项.
- `pnpm sync watch all -f` 监听并在变更时重新打包 (在 `pnpm watch` 期间自动启动).

## CI / Git

- `.github/workflows/bundle.yaml`: 推送到 `master`/`main` 时，重新构建 `dist/` 并提交. 同时自动打标签，以便 jsdelivr 在约 12 小时内刷新缓存.
- `.github/workflows/bump_deps.yaml`: 每 3 天更新依赖并从上游刷新 `@types/`.
- `.github/workflows/sync_template.yaml`: (针对 fork) 打开 PR 同步模板更新.
- `.gitattributes` 中的 `dist/** merge=ours` 可防止 `dist/` 中的合并冲突. 只需执行一次: `git config --global merge.ours.driver true`.

## 代码检查与类型检查说明

- `tsconfig.json` 设置了 `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`.
- Webpack `ts-loader` 在打包期间将这些覆盖为 `false`，因此构建不会因未使用变量而失败；清理工作依赖 `pnpm lint`.
- ESLint 忽略 `dist/`, `node_modules/`, 以及配置文件本身.

## 开发服务器 / 调试

- `.vscode/launch.json` 默认假设酒馆页面位于 `http://localhost:8000`.
- Source maps 配置了 `src://tavern_helper_template/*` 和 `webpack://tavern_helper_template/*` 覆盖路径.
- 如果在本地修改了启动 URL，建议运行 `git update-index --skip-worktree .vscode/launch.json` 以避免将其暴露到版本控制中.
