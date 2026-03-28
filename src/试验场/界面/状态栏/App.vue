<template>
  <div class="farm-card">
    <header class="hero">
      <div>
        <div class="eyebrow">实验场 · 农场总览</div>
        <h1>第 {{ store.data.世界.第几天 }} 天</h1>
        <p>{{ store.data.世界.今日结算说明 }}</p>
      </div>
      <div class="weather-chip">{{ store.data.世界.天气 }}</div>
    </header>

    <section class="summary-grid">
      <article class="summary-box">
        <span class="summary-label">资金</span>
        <strong class="summary-value">{{ store.data.农场.资金 }}</strong>
      </article>
      <article class="summary-box">
        <span class="summary-label">在职人数</span>
        <strong class="summary-value">{{ hired_count }}</strong>
      </article>
      <article class="summary-box">
        <span class="summary-label">市场候选</span>
        <strong class="summary-value">{{ market_count }}</strong>
      </article>
      <article class="summary-box">
        <span class="summary-label">可收获地块</span>
        <strong class="summary-value">{{ harvestable_count }}</strong>
      </article>
    </section>

    <section class="panel">
      <div class="panel-head">
        <h2>地块</h2>
        <span>{{ plot_entries.length }} 块</span>
      </div>
      <div class="plot-grid">
        <article v-for="[name, plot] in plot_entries" :key="name" class="plot-card" :class="plotClass(plot.状态)">
          <div class="plot-top">
            <strong>{{ name }}</strong>
            <span class="status-pill">{{ plot.状态 }}</span>
          </div>
          <dl>
            <div>
              <dt>作物</dt>
              <dd>{{ plot.作物 }}</dd>
            </div>
            <div>
              <dt>剩余天数</dt>
              <dd>{{ plot.剩余生长天数 }}</dd>
            </div>
            <div>
              <dt>负责员工</dt>
              <dd>{{ plot.负责员工 }}</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>

    <section class="double-panel">
      <article class="panel">
        <div class="panel-head">
          <h2>已雇员工</h2>
          <span>{{ hired_count }} 人</span>
        </div>
        <div v-if="hired_entries.length" class="staff-list">
          <article v-for="[name, worker] in hired_entries" :key="name" class="staff-card">
            <div class="staff-top">
              <strong>{{ name }}</strong>
              <span>{{ worker.工种 }}</span>
            </div>
            <div class="staff-meta">日薪 {{ worker.日薪 }} · 体力 {{ worker.体力 }}</div>
            <div class="staff-task">{{ worker.当前任务 }}</div>
          </article>
        </div>
        <div v-else class="empty-state">当前没有已雇员工。</div>
      </article>

      <article class="panel">
        <div class="panel-head">
          <h2>员工市场</h2>
          <span>{{ market_count }} 人</span>
        </div>
        <div v-if="market_entries.length" class="staff-list">
          <article v-for="[name, worker] in market_entries" :key="name" class="staff-card market-card">
            <div class="staff-top">
              <strong>{{ name }}</strong>
              <span>{{ worker.工种 }}</span>
            </div>
            <div class="staff-meta">日薪 {{ worker.日薪 }} · 体力 {{ worker.体力 }}</div>
            <div class="staff-task">待招募</div>
          </article>
        </div>
        <div v-else class="empty-state">员工市场暂时没有新劳动力。</div>
      </article>
    </section>

    <section class="panel">
      <div class="panel-head">
        <h2>待处理提示</h2>
        <span>{{ hint_entries.length }} 条</span>
      </div>
      <ul v-if="hint_entries.length" class="hint-list">
        <li v-for="[title, message] in hint_entries" :key="title">
          <strong>{{ title }}</strong>
          <span>{{ message }}</span>
        </li>
      </ul>
      <div v-else class="empty-state">当前没有待处理提示。</div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from './store';

const store = useDataStore();

const plot_entries = computed(() => Object.entries(store.data.农场.地块));
const hired_entries = computed(() => Object.entries(store.data.已雇员工));
const market_entries = computed(() => Object.entries(store.data.员工市场));
const hint_entries = computed(() => Object.entries(store.data.待处理提示));

const hired_count = computed(() => hired_entries.value.length);
const market_count = computed(() => market_entries.value.length);
const harvestable_count = computed(() => plot_entries.value.filter(([, plot]) => plot.状态 === '可收获').length);

function plotClass(status: string) {
  return {
    idle: status === '空闲',
    growing: status === '种植中',
    harvest: status === '可收获',
  };
}
</script>

<style lang="scss" scoped>
.farm-card {
  width: 100%;
  max-width: 820px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: #243127;
  font-size: 13px;
  line-height: 1.45;
}

.hero,
.panel,
.summary-box {
  background: #f8fbf4;
  border: 1px solid #c9d8c0;
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(53, 78, 44, 0.08);
}

.hero {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
}

.eyebrow {
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #69815e;
  margin-bottom: 4px;
}

.hero h1,
.panel h2 {
  margin: 0;
}

.hero p {
  margin: 8px 0 0;
  color: #51654d;
}

.weather-chip {
  align-self: flex-start;
  padding: 6px 10px;
  border-radius: 999px;
  background: #e2f1d9;
  color: #355a2a;
  font-weight: 700;
  white-space: nowrap;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.summary-box {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-label {
  color: #65805e;
  font-size: 12px;
}

.summary-value {
  font-size: 20px;
}

.panel {
  padding: 14px;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.panel-head span {
  color: #6a7f66;
  font-size: 12px;
}

.plot-grid,
.double-panel {
  display: grid;
  gap: 10px;
}

.plot-grid {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.double-panel {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.plot-card,
.staff-card {
  border: 1px solid #d4e0cd;
  border-radius: 12px;
  background: #ffffff;
  padding: 10px;
}

.plot-card.idle {
  background: #f9fbf7;
}

.plot-card.growing {
  background: #f2faed;
}

.plot-card.harvest {
  background: #fff7df;
}

.plot-top,
.staff-top {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 8px;
  border-radius: 999px;
  background: #e7efe0;
  color: #47623d;
  font-size: 12px;
}

.plot-card dl {
  display: grid;
  gap: 6px;
  margin: 0;
}

.plot-card dt {
  font-size: 11px;
  color: #74856d;
}

.plot-card dd {
  margin: 2px 0 0;
  font-weight: 600;
}

.staff-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.market-card {
  background: #fcfdf9;
}

.staff-meta {
  color: #61745c;
  margin-bottom: 4px;
}

.staff-task {
  font-weight: 600;
}

.hint-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.hint-list li {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 10px;
  border-radius: 10px;
  background: #fffdf4;
  border: 1px solid #efe1a6;
}

.empty-state {
  color: #6e7e68;
}

@media (max-width: 720px) {
  .summary-grid,
  .double-panel {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 540px) {
  .hero {
    flex-direction: column;
  }

  .summary-grid,
  .double-panel {
    grid-template-columns: 1fr;
  }
}
</style>
