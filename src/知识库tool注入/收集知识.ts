import { useSettingsStore } from './settings';

type ActivatedEntry = {
  uid: number;
  world: string;
  comment?: string;
  content?: string;
  position?: number;
  outletName?: string;
  [key: string]: any;
};

export type KnowledgeItem = {
  uid: number;
  world: string;
  title: string;
  content: string;
};

let pending: KnowledgeItem[] = [];
let currentGenType = '';
let currentDryRun = false;

export function getPendingKnowledge(): KnowledgeItem[] {
  return pending;
}

export function clearPendingKnowledge(): void {
  pending = [];
}

export function getCurrentGenType(): string {
  return currentGenType;
}

export function isCurrentDryRun(): boolean {
  return currentDryRun;
}

export function startCollecting(): { stop: () => void } {
  const stopType = eventOn(tavern_events.GENERATION_AFTER_COMMANDS, (type: string, _option: any, dry_run: boolean) => {
    currentGenType = type;
    currentDryRun = dry_run;
  });

  const stopActivated = eventOn(tavern_events.WORLD_INFO_ACTIVATED, (entries: ActivatedEntry[]) => {
    const { settings } = useSettingsStore();
    if (!settings.enabled) {
      pending = [];
      return;
    }

    const prefix = settings.title_prefix;
    const items: KnowledgeItem[] = [];
    for (const entry of entries ?? []) {
      const comment = entry?.comment;
      if (typeof comment !== 'string' || !comment.trim().startsWith(prefix)) continue;
      const content = typeof entry?.content === 'string' ? entry.content : '';
      items.push({
        uid: entry.uid,
        world: entry.world,
        title: comment,
        content,
      });
    }

    pending = items;
    if (items.length > 0) {
      console.info(`[知识库tool注入] 收集到 ${items.length} 条知识: ${items.map(i => i.title).join(', ')}`);
    }
  });

  return { stop: () => { stopType.stop(); stopActivated.stop(); } };
}