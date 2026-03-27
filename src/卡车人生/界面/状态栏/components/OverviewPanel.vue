<template>
  <section class="overview-layout">
    <article class="panel-card info-card">
      <div class="section-head">
        <span class="section-title">运行总览</span>
        <span class="money-pill">€ {{ balance_text }}</span>
      </div>

      <div class="meta-grid">
        <div class="meta-item">
          <span class="meta-label">位置</span>
          <span class="meta-value">{{ location_line }}</span>
          <span class="meta-sub">{{ store.data.世界.位置.地点类型 }} · {{ store.data.世界.位置.道路 }}</span>
        </div>

        <div class="meta-item">
          <span class="meta-label">时间</span>
          <span class="meta-value">{{ store.data.世界.时间.时刻 }}</span>
          <span class="meta-sub">{{ store.data.世界.时间.日期 }}</span>
        </div>

        <div class="meta-item">
          <span class="meta-label">天气</span>
          <span class="meta-value">{{ weather_icon }} {{ weather_text }}</span>
          <span class="meta-sub">{{ temperature_text }}</span>
        </div>
      </div>
    </article>

    <article class="panel-card">
      <div class="section-head">
        <span class="section-title">驾驶状态</span>
      </div>

      <div class="quick-grid">
        <div class="quick-item">
          <div class="quick-head">
            <span>⛽ 油量</span>
            <span :class="['quick-emphasis', { warn: fuel_percent <= 20 }]">{{ fuel_text }}</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill fuel" :class="{ warn: fuel_percent <= 20 }" :style="{ width: `${fuel_percent}%` }"></div>
          </div>
          <span class="quick-hint">容量 {{ store.data.车辆.组件.油箱.容量L }}L</span>
        </div>

        <div class="quick-item">
          <div class="quick-head">
            <span>😴 疲劳</span>
            <span class="pill" :class="fatigue_class">{{ store.data.车辆.疲劳 }}</span>
          </div>
          <div class="quick-line">{{ fatigue_hint }}</div>
        </div>

        <div class="quick-item">
          <div class="quick-head">
            <span>🚦 速度</span>
            <span class="pill" :class="{ danger: is_overspeed }">{{ is_overspeed ? '超速' : '正常' }}</span>
          </div>
          <div class="quick-line" :class="{ overspeed: is_overspeed }">{{ speed_text }}</div>
          <span class="quick-hint">限速 {{ limit_text }}</span>
        </div>

        <div class="quick-item">
          <div class="quick-head">
            <span>📦 运输</span>
            <span class="pill" :class="transport_class">{{ store.data.运输.状态 }}</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill trip" :style="{ width: `${trip_percent}%` }"></div>
          </div>
          <span class="quick-hint">{{ trip_hint }}</span>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
const formatter = new Intl.NumberFormat('en-US');

const weather_map: Record<string, { icon: string; label: string }> = {
  clear: { icon: '☀️', label: '晴朗' },
  cloudy: { icon: '⛅', label: '多云' },
  overcast: { icon: '☁️', label: '阴天' },
  rain: { icon: '🌧️', label: '降雨' },
  storm: { icon: '⛈️', label: '风暴' },
  snow: { icon: '❄️', label: '降雪' },
  fog: { icon: '🌫️', label: '有雾' },
  wind: { icon: '💨', label: '大风' },
};

const balance_text = computed(() => formatter.format(store.data.经济.余额));

const location_line = computed(() => {
  const { 国家, 城市 } = store.data.世界.位置;
  return `${国家} · ${城市}`;
});

const weather_info = computed(() => weather_map[store.data.世界.天气.代码] ?? { icon: '🌤️', label: store.data.世界.天气.代码 });
const weather_icon = computed(() => weather_info.value.icon);
const weather_text = computed(() => weather_info.value.label);
const temperature_text = computed(() => `${store.data.世界.天气.气温}°C`);

const fuel_percent = computed(() => {
  const capacity = store.data.车辆.组件.油箱.容量L;
  const current = store.data.车辆.燃油.当前L;
  if (capacity <= 0) {
    return 0;
  }
  return _.clamp(Math.round((current / capacity) * 100), 0, 100);
});

const fuel_text = computed(() => `${store.data.车辆.燃油.当前L}/${store.data.车辆.组件.油箱.容量L}L`);

const fatigue_hint_map: Record<string, string> = {
  低: '精神稳定，可继续行驶',
  中: '已出现轻微疲态',
  高: '困倦明显，建议靠站休整',
  危险: '继续驾驶将有事故风险',
};

const fatigue_hint = computed(() => fatigue_hint_map[store.data.车辆.疲劳] ?? '状态未知');

const fatigue_class = computed(() => ({
  safe: store.data.车辆.疲劳 === '低',
  caution: store.data.车辆.疲劳 === '中',
  warn: store.data.车辆.疲劳 === '高',
  danger: store.data.车辆.疲劳 === '危险',
}));

const speed_text = computed(() => `${store.data.车辆.行驶.车速} km/h`);
const limit_text = computed(() => `${store.data.车辆.行驶.限速 || '--'} km/h`);
const is_overspeed = computed(() => store.data.车辆.行驶.限速 > 0 && store.data.车辆.行驶.车速 > store.data.车辆.行驶.限速);

const trip_percent = computed(() => {
  const total = store.data.运输.当前货单.总距离km;
  const remaining = store.data.运输.当前货单.剩余km;
  if (total <= 0) {
    return store.data.运输.状态 === '已完成' ? 100 : 0;
  }
  return _.clamp(Math.round(((total - remaining) / total) * 100), 0, 100);
});

const trip_hint = computed(() => {
  if (store.data.运输.状态 === '待选择') {
    return '尚未接取货单';
  }
  return `剩余 ${store.data.运输.当前货单.剩余km} / ${store.data.运输.当前货单.总距离km} km`;
});

const transport_class = computed(() => ({
  neutral: ['待选择', '待出发'].includes(store.data.运输.状态),
  safe: ['运输中', '交货中'].includes(store.data.运输.状态),
  success: store.data.运输.状态 === '已完成',
}));
</script>

<style lang="scss" scoped>
.overview-layout {
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

.info-card {
  background:
    linear-gradient(180deg, rgba(245, 158, 11, 0.08), transparent 60%),
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

.money-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 4px 10px;
  background: rgba(34, 197, 94, 0.14);
  color: #bbf7d0;
  font-size: 0.8rem;
  font-weight: 700;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.88);
}

.meta-label {
  font-size: 0.72rem;
  color: var(--c-muted);
}

.meta-value {
  font-size: 0.95rem;
  color: var(--c-text);
  font-weight: 700;
}

.meta-sub {
  font-size: 0.78rem;
  color: var(--c-muted);
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.quick-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.88);
}

.quick-head {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  color: var(--c-muted);
  font-size: 0.78rem;
}

.quick-emphasis {
  color: #bbf7d0;
  font-weight: 700;
}

.quick-emphasis.warn {
  color: #fecaca;
}

.quick-line {
  color: var(--c-text);
  font-size: 1.02rem;
  font-weight: 700;
}

.quick-line.overspeed {
  color: #fca5a5;
}

.quick-hint {
  color: var(--c-muted);
  font-size: 0.74rem;
}

.progress-track {
  width: 100%;
  height: 9px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(51, 65, 85, 0.86);
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  transition: width 0.25s ease;
}

.progress-fill.fuel {
  background: linear-gradient(90deg, #22c55e, #84cc16);
}

.progress-fill.fuel.warn {
  background: linear-gradient(90deg, #f97316, #ef4444);
}

.progress-fill.trip {
  background: linear-gradient(90deg, #38bdf8, #a78bfa);
}

.pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.7rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  color: var(--c-text);
}

.pill.safe,
.pill.success {
  background: rgba(34, 197, 94, 0.14);
  color: #bbf7d0;
}

.pill.caution,
.pill.neutral {
  background: rgba(234, 179, 8, 0.14);
  color: #fde68a;
}

.pill.warn {
  background: rgba(249, 115, 22, 0.14);
  color: #fdba74;
}

.pill.danger {
  background: rgba(239, 68, 68, 0.14);
  color: #fecaca;
}

@media (max-width: 720px) {
  .meta-grid,
  .quick-grid {
    grid-template-columns: 1fr;
  }
}
</style>