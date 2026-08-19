// 将 dist 中打包好的脚本包装成可直接导入酒馆助手的 JSON 文件
// 在 pnpm build 完成后由 postbuild 自动执行; 也可手动运行: node wrap_script_json.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

const scripts = [
  {
    name: '正文后续生成',
    id: '8f7a2b1c-3d4e-4f5a-9b6c-7d8e9f0a1b2c',
    author: 'Custom',
    description: '正文后续生成: 主LLM只输出正文, 由独立辅助LLM并行生成状态栏/选项等正文外内容并写回楼层',
    info: '「正文后续生成」把一次 LLM 输出的多职分工拆开: 主 LLM 只输出正文, 脚本在收到消息后, 用独立的辅助 LLM (可配置独立 API) 并行生成各类「正文后续」内容 (状态栏、选项等, 均为可增删的抽象任务), 并写回消息楼层。\n\n点击「设置」按钮 → 打开设置面板 (配置 API、任务列表与提示词)\n点击「重新生成」按钮 → 为最后一楼重新生成正文后续\n\n🧩 任务抽象: 状态栏、选项只是预置的两个任务实现, 可自由增删改名 (名称/标签/提示词/分隔符)\n📖 前情提要: 辅助请求包含最近 N 层 AI 消息 + 各任务上轮输出, 保证状态连续性\n⚡ 并行生成: 所有启用任务并行请求, 只多一个来回的延迟; 单个任务失败不影响其他\n🧹 标签剥离: 自动注册酒馆正则, 发送给主 LLM 前剥离任务标签, 避免历史污染\n🔌 API 配置: 支持自定义 API (OpenAI/Anthropic 协议自动识别) 或酒馆当前连接\n⏱ 超时兜底: 任何任务超时/失败时保持纯正文, 不阻塞主流程',
    buttons: ['设置', '重新生成'],
    dist: 'dist/脚本/正文后续生成/index.js',
  },
  {
    name: '知识库tool注入',
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    author: 'Custom',
    description: '知识库tool注入: 将世界书中标题以 _知识库 开头的条目伪装为 AI 调用工具后的返回结果注入提示词, 让 AI 能区分知识与用户输入',
    info: '「知识库tool注入」把世界书知识伪装成标准的 tool calling 返回消息注入提示词, 让 AI 清楚地分辨"这是工具返回的知识"而非用户发言。\n\n原理: 监听世界书激活事件, 收集标题以 _知识库 开头且位置设为 Outlet 的条目, 在提示词发出前, 伪造一对 assistant tool_calls + tool 返回消息插入 chat 数组。\n\n使用步骤:\n1. 世界书中要当知识注入的条目标题改为 _知识库 开头\n2. 这些条目位置设为 Outlet, 出口名填 _知识库\n3. 预设里不要放 {{outlet::_知识库}} 宏\n4. 预设"提示词后处理类型"设为 NONE / MERGE_TOOLS / SEMI_TOOLS / STRICT_TOOLS\n5. 后端用 Chat Completion (OpenAI 官方或兼容)\n6. 在酒馆扩展设置的"知识库 tool 注入"面板配置参数, 点"校验配置"确认\n\n⚙️ 可配置: 标题前缀、Outlet 名、工具名、注入深度、是否合并多条目、continue/quiet 是否注入\n🔧 自动校验: 启动时检查后端类型、后处理类型、条目位置是否正确, 不正确则告警',
    buttons: [],
    dist: 'dist/知识库tool注入/index.js',
  },
];

for (const script of scripts) {
  const dist_path = path.join(root, script.dist);
  if (!fs.existsSync(dist_path)) {
    console.warn(`[wrap_script_json] 未找到 ${script.dist}, 跳过 ${script.name}`);
    continue;
  }
  const code = fs.readFileSync(dist_path, 'utf-8');
  const header = `//name: ${script.name}\n//author: ${script.author}\n//description: ${script.description}\n`;
  const json = {
    type: 'script',
    enabled: true,
    name: script.name,
    id: script.id,
    content: header + code,
    info: script.info,
    button: {
      enabled: true,
      buttons: script.buttons.map(name => ({ name, visible: true })),
    },
    data: {},
    export_with: {
      data: true,
      button: true,
    },
  };
  const output_path = path.join(root, 'src', '脚本', `酒馆助手脚本-${script.name}.json`);
  fs.mkdirSync(path.dirname(output_path), { recursive: true });
  fs.writeFileSync(output_path, JSON.stringify(json, null, 2) + '\n', 'utf-8');
  console.log(`[wrap_script_json] 已导出 ${script.name} -> ${path.relative(root, output_path)} (${(json.content.length / 1024).toFixed(1)} KB)`);
}
