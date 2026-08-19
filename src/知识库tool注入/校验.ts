import { useSettingsStore } from './settings';

const TOOL_AWARE_POST_PROCESSING = new Set(['NONE', 'MERGE_TOOLS', 'SEMI_TOOLS', 'STRICT_TOOLS']);

async function collectAllWorldbookNames(): Promise<string[]> {
  const names = new Set<string>();
  for (const n of getWorldbookNames()) names.add(n);
  for (const n of getGlobalWorldbookNames()) names.add(n);
  try {
    const char = getCharWorldbookNames('current');
    if (char.primary) names.add(char.primary);
    for (const n of char.additional) names.add(n);
  } catch { /* 无角色卡时忽略 */ }
  try {
    const chatWb = getChatWorldbookName('current');
    if (chatWb) names.add(chatWb);
  } catch { /* 无聊天时忽略 */ }
  return [...names];
}

export async function validateConfiguration(): Promise<void> {
  const { settings } = useSettingsStore();
  if (!settings.enabled) return;

  const issues: string[] = [];

  if (SillyTavern.mainApi !== 'openai') {
    issues.push('当前后端非 Chat Completion (openai),tool 角色注入可能无效。');
  }

  const postProcessing = SillyTavern.chatCompletionSettings?.custom_prompt_post_processing;
  if (postProcessing && !TOOL_AWARE_POST_PROCESSING.has(postProcessing)) {
    issues.push(`预设"提示词后处理类型"为 '${postProcessing}',会将 tool 消息降级为 user。请改为 NONE / MERGE_TOOLS / SEMI_TOOLS / STRICT_TOOLS。`);
  }

  const prefix = settings.title_prefix;
  const worldbookNames = await collectAllWorldbookNames();
  const wrongPosition: string[] = [];
  let foundCount = 0;

  for (const wbName of worldbookNames) {
    let entries: WorldbookEntry[];
    try {
      entries = await getWorldbook(wbName);
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (!entry.name.trim().startsWith(prefix)) continue;
      foundCount++;
      if (entry.position.type !== 'outlet') {
        wrongPosition.push(`${wbName} / ${entry.name} (当前=${entry.position.type})`);
      }
    }
  }

  if (foundCount === 0) {
    issues.push(`未在任何世界书中找到标题以 '${prefix}' 开头的条目。请确认条目标题是否正确。`);
  }

  if (wrongPosition.length > 0) {
    issues.push(`以下 _知识库 条目位置未设为 Outlet,会被酒馆原逻辑重复注入:\n  ${wrongPosition.join('\n  ')}`);
  }

  if (issues.length === 0) {
    toastr.success('知识库 tool 注入配置校验通过。', '知识库tool注入');
  } else {
    toastr.warning(issues.join('\n\n'), '知识库tool注入', { timeOut: 10000, extendedTimeOut: 5000 });
  }
}