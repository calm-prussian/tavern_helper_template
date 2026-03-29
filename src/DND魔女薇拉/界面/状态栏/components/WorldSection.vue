<template>
  <div class="world-section">
    <div class="world-header">✦ 世界状态 ✦</div>
    <div class="world-body">
      <div class="world-row">
        <span class="label">📅 时间</span>
        <span class="value">{{ data.世界.当前时间 }}</span>
      </div>
      <div class="world-row">
        <span class="label">📍 地点</span>
        <span class="value">{{ data.世界.当前地点 }}</span>
      </div>
      <div v-if="affairs.length > 0" class="affairs">
        <div class="affairs-title">📜 近期事务</div>
        <div v-for="[name, desc] in affairs" :key="name" class="affair-item">
          <span class="affair-name">▸ {{ name }}</span>
          <span class="affair-desc">{{ desc }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
const data = store.data;

const affairs = computed(() => Object.entries(data.世界.近期事务));
</script>

<style scoped>
.world-section {
  padding: 10px 14px 8px;
  border-bottom: 1px solid var(--c-border);
}

.world-header {
  text-align: center;
  font-size: 11px;
  letter-spacing: 0.15em;
  color: var(--c-accent);
  margin-bottom: 6px;
  font-weight: bold;
}

.world-body {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.world-row {
  display: flex;
  gap: 8px;
  font-size: 12px;
  align-items: baseline;
}

.label {
  color: var(--c-muted);
  white-space: nowrap;
  min-width: 60px;
}

.value {
  color: var(--c-text);
  flex: 1;
}

.affairs {
  margin-top: 4px;
}

.affairs-title {
  font-size: 11px;
  color: var(--c-muted);
  margin-bottom: 3px;
}

.affair-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 3px;
  padding-left: 8px;
  border-left: 2px solid var(--c-border);
}

.affair-name {
  font-size: 11px;
  color: var(--c-accent);
  font-weight: bold;
}

.affair-desc {
  font-size: 11px;
  color: var(--c-text);
  opacity: 0.85;
}
</style>
