<template>
  <section class="panel-grid">
    <article class="panel-card highlight-card">
      <div class="section-head">
        <span class="section-title">当前货单</span>
        <span class="pill" :class="status_class">{{ store.data.运输.状态 }}</span>
      </div>

      <div class="cargo-title-row">
        <div>
          <div class="cargo-name">{{ cargo_name }}</div>
          <div class="cargo-sub">{{ trailer_name }}</div>
        </div>
        <div class="reward-box">€ {{ reward_text }}</div>
      </div>

      <div class="route-card">
        <span>{{ store.data.运输.当前货单.起点 }}</span>
        <span class="arrow">→</span>
        <span>{{ store.data.运输.当前货单.终点 }}</span>
      </div>

      <div class="progress-head">
        <span>运输进度</span>
        <span>{{ store.data.运输.当前货单.剩余km }} / {{ store.data.运输.当前货单.总距离km }} km</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: `${trip_percent}%` }"></div>
      </div>
    </article>

    <article class="panel-card">
      <div class="section-head">
        <span class="section-title">时限与监控</span>
      </div>

      <div class="info-list">
        <div class="info-item">
          <span class="label">时限</span>
          <span class="value">{{ deadline_text }}</span>
        </div>
        <div class="info-item">
          <span class="label">剩余时间</span>
          <span class="value">{{ remaining_time_text }}</span>
        </div>
        <div class="info-item">
          <span class="label">任务标签</span>
          <div class="tag-list">
            <span v-for="tag in task_tags" :key="tag" class="tag">{{ tag }}</span>
            <span v-if="!task_tags.length" class="empty-text">无</span>
          </div>
        </div>
      </div>
    </article>

    <article class="panel-card full-span">
      <div class="section-head">
        <span class="section-title">特种任务监控</span>
      </div>

      <div v-if="monitor_entries.length" class="monitor-grid">
        <div v-for="([name, value]) in monitor_entries" :key="name" class="monitor-item">
          <span class="monitor-key">{{ name }}</span>
          <span class="monitor-value">{{ value }}</span>
        </div>
      </div>
      <div v-else class="empty-panel">当前没有需要额外追踪的特种参数。</div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
const formatter = new Intl.NumberFormat('en-US');

const cargo_name = computed(() => store.data.运输.当前货单.货物名称 || '待选择');
const trailer_name = computed(() => store.data.运输.当前货单.挂车类型 || '未指定挂车');
const reward_text = computed(() => formatter.format(store.data.运输.当前货单.报酬));

const trip_percent = computed(() => {
  const total = store.data.运输.当前货单.总距离km;
  const remaining = store.data.运输.当前货单.剩余km;
  if (total <= 0) {
    return store.data.运输.状态 === '已完成' ? 100 : 0;
  }
  return _.clamp(Math.round(((total - remaining) / total) * 100), 0, 100);
});

function formatMinutes(minutes: number) {
  if (minutes <= 0) {
    return '0分';
  }

  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  if (hour <= 0) {
    return `${minute}分`;
  }
  if (minute <= 0) {
    return `${hour}小时`;
  }
  return `${hour}小时${minute}分`;
}

const deadline_text = computed(() => (store.data.运输.当前货单.有时限 ? formatMinutes(store.data.运输.当前货单.时限分钟) : '无时限'));
const remaining_time_text = computed(() => (store.data.运输.当前货单.有时限 ? formatMinutes(store.data.运输.当前货单.剩余时间分钟) : '不限制'));

const task_tags = computed(() => Object.keys(store.data.运输.当前货单.任务标签));
const monitor_entries = computed(() => Object.entries(store.data.运输.当前货单.特种任务监控));

const status_class = computed(() => ({
  neutral: ['待选择', '待出发'].includes(store.data.运输.状态),
  active: ['运输中', '交货中'].includes(store.data.运输.状态),
  done: store.data.运输.状态 === '已完成',
}));
</script>

<style lang="scss" scoped>
.panel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.panel-card {
  padding: 14px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 14px;
}

.highlight-card {
  background:
    linear-gradient(180deg, rgba(245, 158, 11, 0.08), transparent 60%),
    rgba(15, 23, 42, 0.64);
}

.full-span {
  grid-column: 1 / -1;
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

.pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 0.72rem;
}

.pill.neutral {
  background: rgba(234, 179, 8, 0.14);
  color: #fde68a;
}

.pill.active {
  background: rgba(56, 189, 248, 0.14);
  color: #bae6fd;
}

.pill.done {
  background: rgba(34, 197, 94, 0.14);
  color: #bbf7d0;
}

.cargo-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
}

.cargo-name {
  font-size: 1.08rem;
  color: var(--c-text);
  font-weight: 700;
}

.cargo-sub {
  margin-top: 4px;
  color: var(--c-muted);
  font-size: 0.8rem;
}

.reward-box {
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(34, 197, 94, 0.1);
  color: #dcfce7;
  font-weight: 700;
  white-space: nowrap;
}

.route-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.88);
  margin-bottom: 12px;
  color: var(--c-text);
  font-weight: 700;
  text-align: center;
}

.arrow {
  color: var(--c-accent-soft);
}

.progress-head,
.info-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.progress-head {
  margin-bottom: 8px;
  color: var(--c-muted);
  font-size: 0.78rem;
}

.progress-track {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(51, 65, 85, 0.86);
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #38bdf8, #a78bfa);
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.label {
  color: var(--c-muted);
  font-size: 0.8rem;
}

.value {
  color: var(--c-text);
  font-size: 0.84rem;
  text-align: right;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
}

.tag {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.72rem;
  background: rgba(245, 158, 11, 0.12);
  color: #fde68a;
}

.monitor-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.monitor-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 12px;
  background: rgba(30, 41, 59, 0.88);
  border-radius: 12px;
}

.monitor-key {
  color: var(--c-muted);
  font-size: 0.76rem;
}

.monitor-value {
  color: var(--c-text);
  font-size: 0.95rem;
  font-weight: 700;
  word-break: break-word;
}

.empty-panel,
.empty-text {
  color: var(--c-muted);
  font-size: 0.8rem;
}

@media (max-width: 720px) {
  .panel-grid,
  .monitor-grid {
    grid-template-columns: 1fr;
  }

  .cargo-title-row,
  .info-item {
    flex-direction: column;
  }

  .tag-list {
    justify-content: flex-start;
  }

  .value {
    text-align: left;
  }
}
</style>