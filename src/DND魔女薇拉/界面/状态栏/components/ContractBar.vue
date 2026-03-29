<template>
  <div class="contract-bar">
    <div class="bar-header">
      <span class="bar-label">契约认可度</span>
      <span class="bar-stage">【{{ data.薇拉.$认可阶段 }}】</span>
      <span class="bar-value">{{ data.薇拉.契约认可度 }} / 100</span>
    </div>
    <div class="bar-track">
      <div class="bar-fill" :style="{ width: data.薇拉.契约认可度 + '%' }" :class="stageClass"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
const data = store.data;

const stageClass = computed(() => {
  const v = data.薇拉.契约认可度;
  if (v < 20) return 'stage-1';
  if (v < 40) return 'stage-2';
  if (v < 60) return 'stage-3';
  if (v < 80) return 'stage-4';
  return 'stage-5';
});
</script>

<style scoped>
.contract-bar {
  padding: 8px 14px;
  border-bottom: 1px solid var(--c-border);
}

.bar-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 5px;
  font-size: 12px;
}

.bar-label {
  color: var(--c-muted);
  flex: 1;
}

.bar-stage {
  color: var(--c-accent);
  font-weight: bold;
  font-size: 11px;
}

.bar-value {
  color: var(--c-text);
  font-size: 11px;
  min-width: 50px;
  text-align: right;
}

.bar-track {
  height: 8px;
  background: var(--c-border);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}

.stage-1 {
  background: #7a4a6e;
}
.stage-2 {
  background: #8b5e83;
}
.stage-3 {
  background: #9b6fa0;
}
.stage-4 {
  background: #b080c0;
}
.stage-5 {
  background: #c99de0;
}
</style>
