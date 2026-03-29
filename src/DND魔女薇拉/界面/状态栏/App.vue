<template>
  <div class="card">
    <WorldSection />
    <ContractBar />

    <div class="tab-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ active: active_tab === tab.id }"
        @click="active_tab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="content-area">
      <div v-if="active_tab === 'witch'" class="tab-pane active">
        <WitchPanel />
      </div>
      <div v-else-if="active_tab === 'inventory'" class="tab-pane active">
        <InventoryPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ContractBar from './components/ContractBar.vue';
import InventoryPanel from './components/InventoryPanel.vue';
import WitchPanel from './components/WitchPanel.vue';
import WorldSection from './components/WorldSection.vue';

const tabs = [
  { id: 'witch', label: '✦ 薇拉情报' },
  { id: 'inventory', label: '⚔ 持有物品' },
];

const active_tab = useLocalStorage<string>('dnd_vera:active_tab', 'witch');
</script>

<style lang="scss" scoped>
:root {
  --c-bg: #f5ecd7;
  --c-border: #c9a96e;
  --c-text: #3d2b1f;
  --c-muted: #8a6a4a;
  --c-accent: #6b3fa0;
}

.card {
  width: 100%;
  max-width: 680px;
  background-color: var(--c-bg, #f5ecd7);
  border: 2px solid var(--c-border, #c9a96e);
  box-shadow: 4px 4px 0px rgba(60, 40, 10, 0.18);
  display: flex;
  flex-direction: column;
  font-family: 'Georgia', '宋体', serif;
  color: var(--c-text, #3d2b1f);
  font-size: 13px;
  line-height: 1.4;
  margin: 0 auto;
}

.tab-nav {
  display: flex;
  border-bottom: 1px solid var(--c-border, #c9a96e);
}

.tab-btn {
  flex: 1;
  padding: 6px 0;
  background: transparent;
  border: none;
  border-right: 1px solid var(--c-border, #c9a96e);
  cursor: pointer;
  font-size: 12px;
  color: var(--c-muted, #8a6a4a);
  font-family: inherit;
  transition:
    background 0.2s,
    color 0.2s;

  &:last-child {
    border-right: none;
  }

  &.active {
    background: rgba(107, 63, 160, 0.08);
    color: var(--c-accent, #6b3fa0);
    font-weight: bold;
  }

  &:hover:not(.active) {
    background: rgba(201, 169, 110, 0.12);
  }
}

.content-area {
  padding: 12px 14px;
}

.tab-pane {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
