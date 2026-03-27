<template>
  <header class="topbar">
    <div class="brand">
      <span class="icon">🚚</span>
      <div class="brand-text">
        <div class="title">{{ props.title }}</div>
        <div v-if="props.subtitle" class="subtitle">{{ props.subtitle }}</div>
      </div>
    </div>

    <nav class="tabs">
      <button
        v-for="tab in props.tabs"
        :key="tab.id"
        class="tab-button"
        :class="{ active: model === tab.id }"
        :aria-expanded="model === tab.id"
        @click="model = tab.id"
      >
        {{ tab.label }}
      </button>
    </nav>
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  subtitle?: string;
  tabs: { id: string; label: string }[];
}>();

const model = defineModel<string>({ required: true });
</script>

<style lang="scss" scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 14px;
  background:
    radial-gradient(circle at top right, rgba(245, 158, 11, 0.18), transparent 45%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.94), rgba(15, 23, 42, 0.88));
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.icon {
  font-size: 1.3rem;
}

.brand-text {
  min-width: 0;
}

.title {
  color: var(--c-text);
  font-size: 1.02rem;
  font-weight: 700;
  white-space: nowrap;
}

.subtitle {
  color: var(--c-muted);
  font-size: 0.75rem;
  margin-top: 2px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.tabs {
  display: flex;
  background: rgba(15, 23, 42, 0.56);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 10px;
  overflow: hidden;
}

.tab-button {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--c-muted);
  padding: 9px 12px;
  cursor: pointer;
  font-size: 0.84rem;
  letter-spacing: 0.04em;
  transition: 0.2s ease;
  border-right: 1px solid rgba(148, 163, 184, 0.15);
  white-space: nowrap;
}

.tab-button:last-child {
  border-right: none;
}

.tab-button:hover {
  color: var(--c-text);
  background: rgba(245, 158, 11, 0.08);
}

.tab-button.active {
  color: var(--c-text);
  background:
    linear-gradient(180deg, rgba(245, 158, 11, 0.28), rgba(245, 158, 11, 0.12)),
    rgba(15, 23, 42, 0.72);
  box-shadow: inset 0 -1px 0 var(--c-accent);
}

@media (max-width: 860px) {
  .topbar {
    flex-direction: column;
    align-items: stretch;
  }

  .tabs {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .tab-button {
    text-align: center;
    padding: 10px 6px;
    font-size: 0.8rem;
  }

  .tab-button:nth-child(2n) {
    border-right: none;
  }

  .tab-button:nth-child(-n + 2) {
    border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  }
}
</style>