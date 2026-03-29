<template>
  <div class="inventory-panel">
    <div class="section-title">✦ 主角持有物 ✦</div>

    <div v-if="items.length === 0" class="empty-tip">—— 空无一物 ——</div>

    <div v-else class="item-list">
      <div v-for="[name, item] in items" :key="name" class="item-row">
        <div class="item-header">
          <span class="item-name">▸ {{ name }}</span>
          <span class="item-count">× {{ item.数量 }}</span>
        </div>
        <div class="item-desc">{{ item.描述 }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
const data = store.data;

const items = computed(() => Object.entries(data.主角.物品栏));
</script>

<style scoped>
.inventory-panel {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title {
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  color: var(--c-accent);
  letter-spacing: 0.1em;
  margin-bottom: 4px;
}

.empty-tip {
  text-align: center;
  color: var(--c-muted);
  font-size: 11px;
  opacity: 0.6;
  padding: 8px 0;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-row {
  border-left: 2px solid var(--c-border);
  padding-left: 8px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-name {
  font-size: 12px;
  font-weight: bold;
  color: var(--c-text);
}

.item-count {
  font-size: 11px;
  color: var(--c-muted);
  background: var(--c-border);
  padding: 1px 5px;
  border-radius: 3px;
}

.item-desc {
  font-size: 11px;
  color: var(--c-text);
  opacity: 0.75;
  margin-top: 2px;
}
</style>
