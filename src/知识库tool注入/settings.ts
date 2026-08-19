const Settings = z
  .object({
    enabled: z.boolean().default(true),
    mode: z.enum(['auto_tool', 'force_inject']).default('auto_tool'),
    title_prefix: z.string().default('_知识库'),
    outlet_name: z.string().default('_知识库'),
    tool_name: z.string().default('knowledge_lookup'),
    tool_description: z.string().default('查询世界观或知识库资料'),
    injection_depth: z.number().int().min(0).default(0),
    group_multiple: z.boolean().default(true),
    inject_on_continue: z.boolean().default(true),
    inject_on_quiet: z.boolean().default(false),
    tool_hint: z.boolean().default(true),
  })
  .prefault({});

export type KnowledgeSettings = z.infer<typeof Settings>;

export const useSettingsStore = defineStore('knowledge_tool_settings', () => {
  const settings = ref(Settings.parse(getVariables({ type: 'script', script_id: getScriptId() })));

  watchEffect(() => {
    insertOrAssignVariables(klona(settings.value), { type: 'script', script_id: getScriptId() });
  });

  return { settings };
});