<template>
  <div class="card">
    <!-- 常驻头部 -->
    <HeaderCard />

    <!-- 标签导航 -->
    <div class="tab-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ active: active_tab === tab.id }"
        @click="toggleTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 内容区 -->
    <div v-if="active_tab" class="content-area">
      <div class="tab-pane active">
        <MacroPanel v-if="active_tab === 'macro'" />
        <CityPanel v-else-if="active_tab === 'city'" />
        <FactionPanel v-else-if="active_tab === 'faction'" />
        <EventPanel v-else-if="active_tab === 'event'" />
        <HistoryPanel v-else-if="active_tab === 'history'" />
        <PlayerPanel v-else-if="active_tab === 'player'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CityPanel from './components/CityPanel.vue';
import EventPanel from './components/EventPanel.vue';
import FactionPanel from './components/FactionPanel.vue';
import HeaderCard from './components/HeaderCard.vue';
import HistoryPanel from './components/HistoryPanel.vue';
import MacroPanel from './components/MacroPanel.vue';
import PlayerPanel from './components/PlayerPanel.vue';

const tabs = [
  { id: 'macro', label: '局势' },
  { id: 'city', label: '城市' },
  { id: 'faction', label: '派系' },
  { id: 'event', label: '事件' },
  { id: 'history', label: '历史' },
  { id: 'player', label: '玩家' },
];

const active_tab = ref<string | null>(null);

function toggleTab(id: string) {
  active_tab.value = active_tab.value === id ? null : id;
}
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  max-width: 720px;
  background-color: var(--c-parchment);
  border: 2.5px solid var(--c-ink);
  box-shadow: 6px 6px 0 rgba(26, 18, 9, 0.15);
  display: flex;
  flex-direction: column;
  font-family: var(--font-body);
  color: var(--c-ink);
  font-size: 13px;
  line-height: 1.4;
  margin: 0 auto;
}

.tab-nav {
  display: flex;
  background: var(--c-ink);
  border-top: 1px solid rgba(158, 136, 102, 0.4);
}

.tab-btn {
  flex: 1;
  padding: 7px 4px;
  border: none;
  border-right: 1px solid rgba(158, 136, 102, 0.3);
  background: transparent;
  color: var(--c-sepia);
  font-size: 0.8rem;
  font-family: var(--font-headline);
  font-weight: bold;
  cursor: pointer;
  transition: all 0.15s;
  letter-spacing: 0.02em;

  &:last-child {
    border-right: none;
  }

  &:hover {
    background: rgba(158, 136, 102, 0.2);
    color: var(--c-parchment);
  }

  &.active {
    background: var(--c-parchment);
    color: var(--c-ink);
    position: relative;
  }
}

.content-area {
  padding: 12px;
  background: var(--c-parchment);
  min-height: 0;
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
