<template>
  <section class="archive-layout">
    <article class="panel-card hero-card">
      <div class="section-head">
        <span class="section-title">驾驶档案</span>
      </div>

      <div class="archive-grid">
        <div class="archive-item">
          <span class="meta-label">累计里程</span>
          <span class="archive-value">{{ total_distance_text }}</span>
          <span class="meta-sub">记录所有有效行驶推进</span>
        </div>

        <div class="archive-item">
          <span class="meta-label">累计油耗</span>
          <span class="archive-value">{{ total_fuel_used_text }}</span>
          <span class="meta-sub">按真实燃油消耗累计</span>
        </div>

        <div class="archive-item">
          <span class="meta-label">完成货单</span>
          <span class="archive-value">{{ completed_order_text }}</span>
          <span class="meta-sub">仅统计已结算任务</span>
        </div>

        <div class="archive-item">
          <span class="meta-label">累计收入</span>
          <span class="archive-value">€ {{ total_income_text }}</span>
          <span class="meta-sub">仅统计正向入账</span>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
const formatter = new Intl.NumberFormat('en-US');

const total_distance_text = computed(() => `${formatter.format(store.data.驾驶档案.累计里程km)} km`);
const total_fuel_used_text = computed(() => `${formatter.format(store.data.驾驶档案.累计油耗L)} L`);
const completed_order_text = computed(() => `${formatter.format(store.data.驾驶档案.累计完成货单数)} 单`);
const total_income_text = computed(() => formatter.format(store.data.驾驶档案.累计收入));
</script>

<style lang="scss" scoped>
.archive-layout {
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

.hero-card {
  background: linear-gradient(180deg, rgba(56, 189, 248, 0.08), transparent 60%), rgba(15, 23, 42, 0.64);
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

.meta-label {
  font-size: 0.72rem;
  color: var(--c-muted);
}

.meta-sub {
  font-size: 0.78rem;
  color: var(--c-muted);
}

.archive-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.archive-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.88);
}

.archive-value {
  font-size: 1.02rem;
  color: var(--c-text);
  font-weight: 700;
}

@media (max-width: 720px) {
  .archive-grid {
    grid-template-columns: 1fr;
  }
}
</style>
