<template>
  <section class="vehicle-layout">
    <article class="panel-card overview-card">
      <div class="section-head">
        <span class="section-title">车辆总览</span>
        <span class="summary-pill" :class="summary_class">{{ summary_text }}</span>
      </div>

      <div class="truck-name">{{ store.data.车辆.车型.品牌 }} {{ store.data.车辆.车型.型号 }}</div>
      <div class="truck-meta">
        <span>{{ store.data.车辆.车型.驾驶室规格 }} 驾驶室</span>
        <span>{{ store.data.车辆.车型.底盘规格 }} 底盘</span>
        <span>{{ store.data.车辆.组件.油箱.型号 }}</span>
      </div>
    </article>

    <article class="panel-card full-span">
      <div class="section-head">
        <span class="section-title">部件状态</span>
      </div>

      <div class="component-list">
        <div v-for="item in component_items" :key="item.name" class="component-row">
          <div class="component-info">
            <div class="component-title-line">
              <span class="component-name">{{ item.name }}</span>
              <span class="status-pill" :class="condition_class_map[item.condition]">{{ item.condition }}</span>
            </div>
            <div class="component-model">{{ item.model }}</div>
            <div class="component-performance">{{ item.performance }}</div>
          </div>

          <div class="condition-meter">
            <span
              v-for="dot in 4"
              :key="dot"
              class="dot"
              :class="[{ active: dot <= item.score }, condition_class_map[item.condition]]"
            ></span>
          </div>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const score_map = {
  优秀: 4,
  良好: 3,
  注意: 2,
  需维修: 1,
} as const;

const condition_class_map = {
  优秀: 'excellent',
  良好: 'good',
  注意: 'warning',
  需维修: 'danger',
} as const;

const component_items = computed(() => [
  {
    name: '发动机',
    model: store.data.车辆.组件.发动机.型号,
    performance: store.data.车辆.组件.发动机.性能,
    condition: store.data.车辆.车况.发动机,
    score: score_map[store.data.车辆.车况.发动机],
  },
  {
    name: '变速箱',
    model: store.data.车辆.组件.变速箱.型号,
    performance: store.data.车辆.组件.变速箱.性能,
    condition: store.data.车辆.车况.变速箱,
    score: score_map[store.data.车辆.车况.变速箱],
  },
  {
    name: '轮胎',
    model: store.data.车辆.组件.轮胎.型号,
    performance: store.data.车辆.组件.轮胎.性能,
    condition: store.data.车辆.车况.轮胎,
    score: score_map[store.data.车辆.车况.轮胎],
  },
  {
    name: '刹车',
    model: store.data.车辆.组件.刹车.型号,
    performance: store.data.车辆.组件.刹车.性能,
    condition: store.data.车辆.车况.刹车,
    score: score_map[store.data.车辆.车况.刹车],
  },
  {
    name: '底盘',
    model: store.data.车辆.组件.悬挂.型号,
    performance: store.data.车辆.组件.悬挂.性能,
    condition: store.data.车辆.车况.底盘,
    score: score_map[store.data.车辆.车况.底盘],
  },
]);

const summary_text = computed(() => {
  const values = component_items.value.map(item => item.condition);
  if (values.includes('需维修')) {
    return '需安排维修';
  }
  if (values.includes('注意')) {
    return '存在注意项';
  }
  if (values.every(value => value === '优秀')) {
    return '全车优秀';
  }
  return '整体良好';
});

const summary_class = computed(() => {
  if (summary_text.value === '需安排维修') {
    return 'danger';
  }
  if (summary_text.value === '存在注意项') {
    return 'warning';
  }
  if (summary_text.value === '全车优秀') {
    return 'excellent';
  }
  return 'good';
});
</script>

<style lang="scss" scoped>
.vehicle-layout {
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

.overview-card {
  background:
    linear-gradient(180deg, rgba(56, 189, 248, 0.08), transparent 60%),
    rgba(15, 23, 42, 0.64);
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

.truck-name {
  color: var(--c-text);
  font-size: 1.08rem;
  font-weight: 700;
}

.truck-meta {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: var(--c-muted);
  font-size: 0.8rem;
}

.truck-meta span {
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(30, 41, 59, 0.88);
}

.summary-pill,
.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
}

.excellent {
  background: rgba(56, 189, 248, 0.14);
  color: #bae6fd;
}

.good {
  background: rgba(34, 197, 94, 0.14);
  color: #bbf7d0;
}

.warning {
  background: rgba(249, 115, 22, 0.14);
  color: #fdba74;
}

.danger {
  background: rgba(239, 68, 68, 0.14);
  color: #fecaca;
}

.component-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.component-row {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.88);
}

.component-info {
  min-width: 0;
}

.component-title-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.component-name {
  color: var(--c-text);
  font-weight: 700;
}

.component-model,
.component-performance {
  margin-top: 4px;
  color: var(--c-muted);
  font-size: 0.8rem;
}

.condition-meter {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(71, 85, 105, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.18);
}

.dot.active.excellent {
  background: #38bdf8;
}

.dot.active.good {
  background: #22c55e;
}

.dot.active.warning {
  background: #f97316;
}

.dot.active.danger {
  background: #ef4444;
}

@media (max-width: 720px) {
  .component-row {
    flex-direction: column;
  }
}
</style>