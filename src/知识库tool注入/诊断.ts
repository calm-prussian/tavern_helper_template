import { useSettingsStore } from './settings';

export type DiagEntry = {
  world: string;
  uid: number;
  name: string;
  position: string;
  contentPreview: string;
  contentLength: number;
};

export type DiagResult = {
  worldbookCount: number;
  worldbookNames: string[];
  matched: DiagEntry[];
  prefix: string;
  mainApi: string;
  postProcessing: string;
  issues: string[];
};

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

export async function runDiagnostic(): Promise<DiagResult> {
  const { settings } = useSettingsStore();
  const prefix = settings.title_prefix;
  const worldbookNames = await collectAllWorldbookNames();
  const matched: DiagEntry[] = [];
  const issues: string[] = [];

  for (const wbName of worldbookNames) {
    let entries: WorldbookEntry[];
    try {
      entries = await getWorldbook(wbName);
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (!entry.name.trim().startsWith(prefix)) continue;
      matched.push({
        world: wbName,
        uid: entry.uid,
        name: entry.name,
        position: entry.position.type,
        contentPreview: entry.content.slice(0, 80),
        contentLength: entry.content.length,
      });
      if (entry.position.type !== 'outlet') {
        issues.push(`${wbName} / ${entry.name}: 位置是 ${entry.position.type},不是 outlet,会被重复注入`);
      }
    }
  }

  if (matched.length === 0) {
    issues.push(`未在任何世界书中找到标题以 '${prefix}' 开头的条目`);
  }

  const postProcessing = SillyTavern.chatCompletionSettings?.custom_prompt_post_processing ?? '(未设置)';

  return {
    worldbookCount: worldbookNames.length,
    worldbookNames,
    matched,
    prefix,
    mainApi: String(SillyTavern.mainApi ?? '(未知)'),
    postProcessing,
    issues,
  };
}