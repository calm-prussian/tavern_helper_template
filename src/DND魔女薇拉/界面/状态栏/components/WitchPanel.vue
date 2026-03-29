<template>
  <div class="witch-panel">
    <div class="section-title">✦ 薇拉 · 阿莫尼亚斯 ✦</div>

    <div class="info-row">
      <span class="label">魔力状态</span>
      <span class="value mana" :class="manaClass">{{ data.薇拉.魔力状态 }}</span>
    </div>

    <div class="divider">── 着装 ──</div>
    <div class="outfit-grid">
      <div class="outfit-row">
        <span class="outfit-label">外袍</span>
        <span class="outfit-value">{{ data.薇拉.着装.外袍 }}</span>
      </div>
      <div class="outfit-row">
        <span class="outfit-label">内衬</span>
        <span class="outfit-value">{{ data.薇拉.着装.内衬 }}</span>
      </div>
      <div class="outfit-row">
        <span class="outfit-label">配饰</span>
        <span class="outfit-value">{{ data.薇拉.着装.配饰 }}</span>
      </div>
    </div>

    <template v-if="titles.length > 0">
      <div class="divider">── 称号 ──</div>
      <div v-for="[name, info] in titles" :key="name" class="title-item">
        <div class="title-name">【{{ name }}】</div>
        <div class="title-effect">{{ info.效果 }}</div>
        <div class="title-eval">「{{ info.薇拉自评 }}」</div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
const data = store.data;

const titles = computed(() => Object.entries(data.薇拉.称号));

const manaClass = computed(() => ({
  'mana-full': data.薇拉.魔力状态 === '充沛',
  'mana-normal': data.薇拉.魔力状态 === '正常',
  'mana-tired': data.薇拉.魔力状态 === '略显疲惫',
  'mana-drained': data.薇拉.魔力状态 === '严重透支',
}));
</script>

<style scoped>
.witch-panel {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.section-title {
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  color: var(--c-accent);
  letter-spacing: 0.1em;
  margin-bottom: 4px;
}

.info-row {
  display: flex;
  gap: 8px;
  font-size: 12px;
  align-items: center;
}

.label {
  color: var(--c-muted);
  min-width: 56px;
}

.value {
  color: var(--c-text);
}

.mana-full {
  color: #5a9e6e;
  font-weight: bold;
}
.mana-normal {
  color: #7ab0d0;
}
.mana-tired {
  color: #c0a050;
}
.mana-drained {
  color: #b04040;
  font-weight: bold;
}

.divider {
  font-size: 10px;
  color: var(--c-muted);
  text-align: center;
  opacity: 0.7;
  margin: 2px 0;
}

.outfit-grid {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.outfit-row {
  display: flex;
  gap: 8px;
  font-size: 11px;
}

.outfit-label {
  color: var(--c-muted);
  min-width: 32px;
  flex-shrink: 0;
}

.outfit-value {
  color: var(--c-text);
  opacity: 0.9;
  flex: 1;
}

.title-item {
  border-left: 2px solid var(--c-accent);
  padding-left: 8px;
  margin-bottom: 4px;
}

.title-name {
  font-size: 12px;
  font-weight: bold;
  color: var(--c-accent);
}

.title-effect {
  font-size: 11px;
  color: var(--c-text);
  opacity: 0.85;
}

.title-eval {
  font-size: 11px;
  color: var(--c-muted);
  font-style: italic;
}
</style>
