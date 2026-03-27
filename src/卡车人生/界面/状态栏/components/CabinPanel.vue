<template>
  <section class="cabin-layout">
    <article class="panel-card">
      <div class="section-head">
        <span class="section-title">驾驶室装饰</span>
        <span class="count-pill">{{ decoration_entries.length }} 项</span>
      </div>

      <div v-if="decoration_entries.length" class="decoration-grid">
        <div v-for="([name, value]) in decoration_entries" :key="name" class="decoration-item">
          <span class="decoration-type">{{ name }}</span>
          <span class="decoration-value">{{ value }}</span>
        </div>
      </div>
      <div v-else class="empty-panel">驾驶室目前还没有额外装饰，整体保持原厂素车风格。</div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const decoration_entries = computed(() => Object.entries(store.data.驾驶室.装饰品).filter(([, value]) => value));
</script>

<style lang="scss" scoped>
.cabin-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.panel-card {
  padding: 14px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 14px;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.section-title {
  font-size: 0.9rem;
  color: var(--c-text);
  font-weight: 700;
}

.count-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  background: rgba(245, 158, 11, 0.14);
  color: #fde68a;
}

.decoration-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.decoration-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.88);
}

.decoration-type {
  color: var(--c-muted);
  font-size: 0.76rem;
}

.decoration-value {
  color: var(--c-text);
  font-size: 0.94rem;
  font-weight: 700;
  word-break: break-word;
}

.empty-panel {
  color: var(--c-muted);
  font-size: 0.82rem;
}

@media (max-width: 720px) {
  .decoration-grid {
    grid-template-columns: 1fr;
  }
}
</style>