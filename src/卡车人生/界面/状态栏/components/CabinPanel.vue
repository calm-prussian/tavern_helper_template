<template>
  <section class="cabin-layout">
    <article class="panel-card">
      <div class="section-head">
        <span class="section-title">电台</span>
        <span class="radio-pill" :class="radio_class">{{ store.data.车辆.电台.状态 }}</span>
      </div>

      <div class="radio-title">{{ radio_title }}</div>
      <div class="radio-meta">
        <span>{{ radio_region }}</span>
        <span>{{ radio_program }}</span>
      </div>
      <p class="radio-desc">{{ radio_description }}</p>
    </article>

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

const radio_class = computed(() => ({
  on: store.data.车辆.电台.状态 === '开启',
  off: store.data.车辆.电台.状态 === '已关闭',
  idle: store.data.车辆.电台.状态 === '未开启',
}));

const radio_title = computed(() => {
  if (store.data.车辆.电台.状态 === '开启') {
    return store.data.车辆.电台.名称 || '正在搜索可用频道';
  }
  if (store.data.车辆.电台.状态 === '已关闭') {
    return '车厢内只剩发动机与风噪';
  }
  return '收音机尚未启动';
});

const radio_region = computed(() => {
  const values = [store.data.车辆.电台.国家, store.data.车辆.电台.地区].filter(Boolean);
  return values.length ? values.join(' · ') : '地区未锁定';
});

const radio_program = computed(() => store.data.车辆.电台.节目类型 || '节目类型未知');

const radio_description = computed(() => {
  if (store.data.车辆.电台.状态 === '开启') {
    return '电台信息会随着路线与地区切换实时变化，可用于营造当前驾驶氛围。';
  }
  if (store.data.车辆.电台.状态 === '已关闭') {
    return '关闭电台后，驾驶舱会明显安静下来，更容易感知转向、胎噪与风切声。';
  }
  return '尚未选择频道，后续可以在剧情中主动开机或调台。';
});
</script>

<style lang="scss" scoped>
.cabin-layout {
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

.radio-pill,
.count-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
}

.radio-pill.on {
  background: rgba(56, 189, 248, 0.14);
  color: #bae6fd;
}

.radio-pill.off {
  background: rgba(148, 163, 184, 0.14);
  color: #cbd5e1;
}

.radio-pill.idle,
.count-pill {
  background: rgba(245, 158, 11, 0.14);
  color: #fde68a;
}

.radio-title {
  color: var(--c-text);
  font-size: 1rem;
  font-weight: 700;
}

.radio-meta {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: var(--c-muted);
  font-size: 0.8rem;
}

.radio-meta span {
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(30, 41, 59, 0.88);
}

.radio-desc {
  margin-top: 12px;
  color: var(--c-muted);
  font-size: 0.82rem;
  line-height: 1.6;
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
  .cabin-layout,
  .decoration-grid {
    grid-template-columns: 1fr;
  }
}
</style>