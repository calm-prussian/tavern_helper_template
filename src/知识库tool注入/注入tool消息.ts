import { useSettingsStore } from './settings';
import { getPendingKnowledge, clearPendingKnowledge, getCurrentGenType, isCurrentDryRun, type KnowledgeItem } from './收集知识';

function buildMergedMessages(
  items: { title: string; content: string }[],
  toolName: string,
): [SillyTavern.SendingMessage, SillyTavern.SendingMessage] {
  const callId = `knowledge_${Date.now()}`;
  const titles = items.map(i => i.title);
  const argumentsJson = JSON.stringify({ queries: titles });
  const toolContent = items.map(i => `## ${i.title}\n\n${i.content}`).join('\n\n---\n\n');

  return [
    { role: 'assistant', content: '', tool_calls: [{ id: callId, type: 'function', function: { name: toolName, arguments: argumentsJson } }] },
    { role: 'tool', content: toolContent, tool_call_id: callId },
  ];
}

function buildIndependentMessages(
  items: { title: string; content: string }[],
  toolName: string,
): SillyTavern.SendingMessage[] {
  const base = Date.now();
  const messages: SillyTavern.SendingMessage[] = [];
  items.forEach((item, idx) => {
    const callId = `knowledge_${base}_${idx}`;
    const argumentsJson = JSON.stringify({ query: item.title });
    messages.push({ role: 'assistant', content: '', tool_calls: [{ id: callId, type: 'function', function: { name: toolName, arguments: argumentsJson } }] });
    messages.push({ role: 'tool', content: `## ${item.title}\n\n${item.content}`, tool_call_id: callId });
  });
  return messages;
}

let needsToolDeclaration = false;
let lastKnowledgeContent = '';

function shouldInject(type: string): boolean {
  const { settings } = useSettingsStore();
  if (!settings.enabled) return false;
  if (type === 'continue' && !settings.inject_on_continue) return false;
  if (type === 'quiet' && !settings.inject_on_quiet) return false;
  return true;
}

function buildToolDefinition(toolName: string, description: string) {
  return {
    type: 'function',
    function: {
      name: toolName,
      description,
      parameters: {
        type: 'object',
        properties: {
          queries: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  };
}

function ensureFallbackTool(toolName: string, description: string): void {
  const ToolManager = (window as any).ToolManager;
  if (!ToolManager?.registerFunctionTool) return;
  ToolManager.unregisterFunctionTool(toolName);
  ToolManager.registerFunctionTool({
    name: toolName,
    displayName: toolName,
    description,
    parameters: { type: 'object', properties: {} },
    action: async () => lastKnowledgeContent || '暂无可用知识数据。',
    formatMessage: async () => '',
    shouldRegister: async () => false,
    stealth: false,
  });
}

function buildTitleList(items: KnowledgeItem[]): string {
  return items.map(i => `- ${i.title}`).join('\n');
}

function buildQueryResult(items: KnowledgeItem[], queries: string[]): string {
  const matched = items.filter(i => queries.includes(i.title));
  if (matched.length > 0) {
    return matched.map(i => `## ${i.title}\n\n${i.content}`).join('\n\n---\n\n');
  }
  return `未找到与查询词完全匹配的条目。当前可查询的条目标题:\n${buildTitleList(items)}`;
}

async function knowledgeLookupAction(params: { queries?: unknown }): Promise<string> {
  const items = getPendingKnowledge();
  if (items.length === 0) return '当前没有可查询的知识条目。';
  const queries = Array.isArray(params?.queries) ? params.queries.filter((q): q is string => typeof q === 'string') : [];
  if (queries.length === 0) {
    return `请传入条目标题作为 queries 参数。当前可查询的条目标题:\n${buildTitleList(items)}`;
  }
  return buildQueryResult(items, queries);
}

function registerRealTool(toolName: string, description: string): void {
  const ToolManager = (window as any).ToolManager;
  if (!ToolManager?.registerFunctionTool) return;
  ToolManager.unregisterFunctionTool(toolName);
  ToolManager.registerFunctionTool({
    name: toolName,
    displayName: toolName,
    description,
    parameters: { type: 'object', properties: { queries: { type: 'array', items: { type: 'string' } } } },
    action: knowledgeLookupAction,
    formatMessage: (params: any) => `查询知识库: ${JSON.stringify(params)}`,
    shouldRegister: async () => {
      const { settings } = useSettingsStore();
      return settings.enabled && settings.mode === 'auto_tool';
    },
    stealth: false,
  });
}

function buildHintMessage(toolName: string, description: string): SillyTavern.SendingMessage {
  const content = `你可以调用工具 "${toolName}"(${description}) 查询世界观知识库。参数 queries 为条目标题列表,可一次传入多个标题。若返回的是条目标题列表,请根据当前对话需要选择相关标题再次查询。查询到结果后,基于返回的知识内容作答。`;
  return { role: 'system', content };
}

export function startInjecting(): { stop: () => void } {
  const { settings } = useSettingsStore();
  registerRealTool(settings.tool_name, settings.tool_description);

  const stopPrompt = eventOn(tavern_events.CHAT_COMPLETION_PROMPT_READY, (event_data: { chat: SillyTavern.SendingMessage[]; dryRun: boolean }) => {
    const { settings } = useSettingsStore();
    const chat = event_data.chat;
    if (!Array.isArray(chat)) return;

    if (settings.mode === 'auto_tool') {
      registerRealTool(settings.tool_name, settings.tool_description);
      if (event_data.dryRun) return;
      if (!settings.tool_hint) return;
      if (!shouldInject(getCurrentGenType())) return;
      const hint = buildHintMessage(settings.tool_name, settings.tool_description);
      if (!chat.some(m => m.role === 'system' && m.content === hint.content)) {
        let insertIdx = 0;
        while (insertIdx < chat.length && chat[insertIdx].role === 'system') insertIdx++;
        chat.splice(insertIdx, 0, hint);
        console.info(`[知识库tool注入] 已注入工具提示 (${settings.tool_name})`);
      }
      return;
    }

    const type = getCurrentGenType();
    if (!shouldInject(type)) return;

    const items = getPendingKnowledge();
    if (items.length === 0) return;

    const messages = settings.group_multiple
      ? buildMergedMessages(items, settings.tool_name)
      : buildIndependentMessages(items, settings.tool_name);

    const insertIdx = Math.max(0, chat.length - settings.injection_depth);
    chat.splice(insertIdx, 0, ...messages);

    needsToolDeclaration = !event_data.dryRun;
    lastKnowledgeContent = items.map(i => `## ${i.title}\n\n${i.content}`).join('\n\n---\n\n');

    console.info(`[知识库tool注入] 已注入 ${items.length} 条知识为 tool 消息 (类型=${type || 'normal'}, 深度=${settings.injection_depth}, 合并=${settings.group_multiple})`);

    if (!isCurrentDryRun()) {
      clearPendingKnowledge();
    }
  });

  const stopSettings = eventOn(tavern_events.CHAT_COMPLETION_SETTINGS_READY, (generate_data: Record<string, any>) => {
    const { settings } = useSettingsStore();
    if (settings.mode !== 'force_inject') return;
    if (!needsToolDeclaration) return;
    needsToolDeclaration = false;

    const definition = buildToolDefinition(settings.tool_name, settings.tool_description);
    if (!Array.isArray(generate_data.tools)) {
      generate_data.tools = [];
    }
    if (!generate_data.tools.some((t: any) => t?.function?.name === settings.tool_name)) {
      generate_data.tools.push(definition);
    }
    ensureFallbackTool(settings.tool_name, settings.tool_description);
  });

  return { stop: () => { stopPrompt.stop(); stopSettings.stop(); } };
}
