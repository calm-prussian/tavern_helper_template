<template>
  <div class="panel-shell">
    <header class="hero-card">
      <div class="eyebrow">{{ store.data.世界.当前日期 }}</div>
      <div class="title">{{ store.data.世界.当前地点 }}</div>
      <div class="subtitle">{{ store.data.世界.当前落脚点 }}</div>
      <div class="chip-row">
        <span class="chip">{{ store.data.世界.当前天气 }}</span>
        <span class="chip accent">{{ store.data.魔女.$魔力阶段 }}</span>
        <span class="chip accent-soft">{{ store.data.关系.$关系阶段 }}</span>
      </div>
    </header>

    <nav class="tab-row">
      <button v-for="tab in tabs" :key="tab.id" class="tab-btn" :class="{ active: active_tab === tab.id }" @click="active_tab = tab.id">
        {{ tab.label }}
      </button>
    </nav>

    <section v-if="active_tab === 'overview'" class="content-grid">
      <article class="card">
        <div class="section-title">世界与旅途</div>
        <div class="kv-row">
          <span>当前目标</span>
          <strong>{{ store.data.旅途.当前目标 }}</strong>
        </div>
        <div class="kv-row">
          <span>周边风险</span>
          <strong>{{ store.data.世界.周边风险 }}</strong>
        </div>
        <div class="kv-row">
          <span>受伤情况</span>
          <strong>{{ store.data.旅途.受伤情况 }}</strong>
        </div>
        <div class="section-subtitle">当日行程</div>
        <div class="record-list">
          <div v-for="(desc, name) in store.data.旅途.当日行程" :key="name" class="record-item">
            <span class="record-name">{{ name }}</span>
            <span class="record-desc">{{ desc }}</span>
          </div>
        </div>
        <div class="section-subtitle">补给情况</div>
        <div class="supply-grid">
          <div v-for="(value, name) in store.data.旅途.补给情况" :key="name" class="supply-card">
            <span class="supply-name">{{ name }}</span>
            <strong>{{ value }}</strong>
          </div>
        </div>
      </article>

      <article class="card">
        <div class="section-title">关系张力</div>
        <div v-for="item in relation_entries" :key="item.name" class="metric-row">
          <div class="metric-head">
            <span>{{ item.name }}</span>
            <strong>{{ item.value }}</strong>
          </div>
          <div class="bar-track">
            <div class="bar-fill" :style="bar_style(item.value)"></div>
          </div>
        </div>
        <div class="stress-box">
          <span>金钱压力</span>
          <strong>{{ store.data.旅途.金钱压力 }}</strong>
        </div>
      </article>
    </section>

    <section v-else-if="active_tab === 'witch'" class="content-grid witch-grid">
      <article class="card">
        <div class="section-title">魔女</div>
        <div class="kv-row"><span>真名</span><strong>{{ store.data.魔女.真名 }}</strong></div>
        <div class="kv-row"><span>伪名</span><strong>{{ store.data.魔女.伪名 }}</strong></div>
        <div class="kv-row"><span>当前情绪</span><strong>{{ store.data.魔女.当前情绪 }}</strong></div>
        <div class="kv-row"><span>封印后遗症</span><strong>{{ store.data.魔女.封印后遗症 }}</strong></div>
        <div class="kv-row"><span>研究主题</span><strong>{{ store.data.魔女.当日研究主题 }}</strong></div>
        <div class="section-subtitle">表面评价</div>
        <div class="quote-box">{{ surface_comment }}</div>
        <div class="section-subtitle">隐藏看法</div>
        <div class="quote-box dim">{{ hidden_comment }}</div>
      </article>

      <article class="card">
        <div class="section-title">契约</div>
        <div class="metric-row solo">
          <div class="metric-head">
            <span>当前约束强度</span>
            <strong>{{ store.data.契约.当前约束强度 }}</strong>
          </div>
          <div class="bar-track">
            <div class="bar-fill accent" :style="bar_style(store.data.契约.当前约束强度)"></div>
          </div>
        </div>
        <div class="metric-row solo">
          <div class="metric-head">
            <span>契约研究进度</span>
            <strong>{{ store.data.契约.契约研究进度 }}</strong>
          </div>
          <div class="bar-track">
            <div class="bar-fill success" :style="bar_style(store.data.契约.契约研究进度)"></div>
          </div>
        </div>
        <div class="kv-row">
          <span>已触发反噬</span>
          <strong>{{ store.data.契约.已触发反噬 ? '是' : '否' }}</strong>
        </div>
        <div class="section-subtitle">可执行范围</div>
        <div class="quote-box">{{ store.data.契约.可执行范围 }}</div>
        <div class="section-subtitle">已知漏洞</div>
        <div class="record-list">
          <div v-for="(desc, name) in store.data.契约.已知漏洞" :key="name" class="record-item">
            <span class="record-name">{{ name }}</span>
            <span class="record-desc">{{ desc }}</span>
          </div>
        </div>
      </article>
    </section>

    <section v-else class="content-grid">
      <article class="card">
        <div class="section-title">重要物品</div>
        <div class="record-list">
          <div v-for="(desc, name) in store.data.旅途.携带的重要物品" :key="name" class="record-item">
            <span class="record-name">{{ name }}</span>
            <span class="record-desc">{{ desc }}</span>
          </div>
        </div>
        <div class="section-subtitle">附近传闻</div>
        <div class="record-list">
          <div v-for="(desc, name) in store.data.世界.附近传闻" :key="name" class="record-item">
            <span class="record-name">{{ name }}</span>
            <span class="record-desc">{{ desc }}</span>
          </div>
        </div>
      </article>

      <article class="card">
        <div class="section-title">世界接触</div>
        <div class="section-subtitle">已见过势力</div>
        <div v-if="_.isEmpty(store.data.世界接触.已见过势力)" class="empty-state">暂未正式接触任何势力。</div>
        <div v-else class="record-list">
          <div v-for="(desc, name) in store.data.世界接触.已见过势力" :key="name" class="record-item">
            <span class="record-name">{{ name }}</span>
            <span class="record-desc">{{ desc }}</span>
          </div>
        </div>

        <div class="section-subtitle">已去过地点</div>
        <div class="record-list">
          <div v-for="(desc, name) in store.data.世界接触.已去过地点" :key="name" class="record-item">
            <span class="record-name">{{ name }}</span>
            <span class="record-desc">{{ desc }}</span>
          </div>
        </div>

        <div class="section-subtitle">已听说人物</div>
        <div class="record-list">
          <div v-for="(desc, name) in store.data.世界接触.已听说人物" :key="name" class="record-item">
            <span class="record-name">{{ name }}</span>
            <span class="record-desc">{{ desc }}</span>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDataStore } from './store';

const store = useDataStore();

const tabs = [
  { id: 'overview', label: '概览' },
  { id: 'witch', label: '魔女 / 契约' },
  { id: 'contact', label: '接触 / 物品' },
] as const;

const active_tab = ref<(typeof tabs)[number]['id']>('overview');

const surface_comment = computed(() => store.data.魔女['对{{user}}的表面评价']);
const hidden_comment = computed(() => store.data.魔女['对{{user}}的隐藏看法']);

const relation_entries = computed(() => [
  { name: '信任', value: store.data.关系.信任 },
  { name: '依赖', value: store.data.关系.依赖 },
  { name: '主导权倾向', value: store.data.关系.主导权倾向 },
  { name: '羞恼值', value: store.data.关系.羞恼值 },
  { name: '欲求张力', value: store.data.关系.欲求张力 },
  { name: '生活默契', value: store.data.关系.生活默契 },
]);

function bar_style(value: number) {
  return { width: `${_.clamp(Number(value), 0, 100)}%` };
}
</script>

<style scoped lang="scss">
.panel-shell {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background:
    radial-gradient(circle at top right, rgba(216, 154, 73, 0.18), transparent 32%),
    linear-gradient(180deg, rgba(14, 16, 22, 0.98), rgba(22, 25, 34, 0.96));
  border: 1px solid var(--line-strong);
  border-radius: 16px;
  box-shadow: var(--shadow);
}

.hero-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(216, 154, 73, 0.1), rgba(30, 35, 45, 0.92));
  border: 1px solid var(--line);
}

.eyebrow {
  font-size: 0.72rem;
  color: var(--muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.title {
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--text);
}

.subtitle {
  font-size: 0.8rem;
  color: var(--muted);
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 2px;
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--line);
  font-size: 0.72rem;
  color: var(--text);
}

.chip.accent {
  background: rgba(216, 154, 73, 0.18);
  color: #ffd49e;
}

.chip.accent-soft {
  background: rgba(125, 177, 138, 0.14);
  color: #cde6d4;
}

.tab-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}

.tab-row::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  appearance: none;
  border: 1px solid var(--line);
  background: var(--panel);
  color: var(--muted);
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: 0.18s ease;
  font-size: 0.78rem;
}

.tab-btn.active {
  color: var(--text);
  background: rgba(216, 154, 73, 0.18);
  border-color: rgba(216, 154, 73, 0.45);
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.witch-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 14px;
  background: var(--panel);
  border: 1px solid var(--line);
  min-width: 0;
}

.section-title {
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.04em;
}

.section-subtitle {
  margin-top: 4px;
  font-size: 0.72rem;
  color: var(--muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.kv-row {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-bottom: 6px;
  border-bottom: 1px dashed var(--line);
  font-size: 0.78rem;
}

.kv-row span {
  color: var(--muted);
}

.kv-row strong {
  color: var(--text);
  line-height: 1.45;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.record-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 8px 9px;
  border-radius: 10px;
  background: var(--panel-soft);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.record-name {
  font-size: 0.75rem;
  font-weight: 700;
  color: #ffd49e;
}

.record-desc {
  font-size: 0.76rem;
  color: var(--text);
  line-height: 1.45;
}

.supply-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
}

.supply-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  border-radius: 10px;
  background: var(--panel-soft);
  border: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 0.76rem;
}

.supply-name {
  color: var(--muted);
}

.metric-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-row.solo {
  margin-bottom: 4px;
}

.metric-head {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 0.76rem;
  color: var(--text);
}

.bar-track {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.bar-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #d89a49, #ffd49e);
}

.bar-fill.accent {
  background: linear-gradient(90deg, #a6692b, #e6bc7b);
}

.bar-fill.success {
  background: linear-gradient(90deg, #5d8f69, #b9d3bf);
}

.quote-box {
  padding: 9px 10px;
  border-radius: 10px;
  background: rgba(216, 154, 73, 0.08);
  border: 1px solid var(--line);
  line-height: 1.52;
  font-size: 0.78rem;
  color: var(--text);
}

.quote-box.dim {
  background: rgba(255, 255, 255, 0.03);
}

.stress-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  padding: 9px 10px;
  border-radius: 10px;
  background: rgba(184, 93, 93, 0.12);
  border: 1px solid rgba(184, 93, 93, 0.24);
  font-size: 0.78rem;
  color: var(--text);
}

.empty-state {
  padding: 8px 0;
  font-size: 0.78rem;
  color: var(--muted);
}

@media (max-width: 720px) {
  .content-grid,
  .witch-grid,
  .supply-grid {
    grid-template-columns: 1fr;
  }
}
</style>
