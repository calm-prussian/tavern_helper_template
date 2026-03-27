<template>
  <header class="header-bar">
    <div class="header-main">
      <div class="header-title-row">
        <span class="icon">🚚</span>
        <div>
          <div class="title">Morgenrot Fracht</div>
          <div class="subtitle">{{ truck_name }}</div>
        </div>
      </div>

      <div class="money-card">
        <span class="money-label">余额</span>
        <span class="money-value">€ {{ balance_text }}</span>
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-card">
        <span class="meta-label">位置</span>
        <span class="meta-value">{{ location_line }}</span>
        <span class="meta-sub">{{ store.data.世界.位置.地点类型 }} · {{ store.data.世界.位置.道路 }}</span>
      </div>

      <div class="meta-card">
        <span class="meta-label">时间</span>
        <span class="meta-value">{{ store.data.世界.时间.时刻 }}</span>
        <span class="meta-sub">{{ store.data.世界.时间.日期 }}</span>
      </div>

      <div class="meta-card weather-card">
        <span class="meta-label">天气</span>
        <span class="meta-value">{{ weather_icon }} {{ weather_text }}</span>
        <span class="meta-sub">{{ temperature_text }}</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

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

const formatter = new Intl.NumberFormat('en-US');

const truck_name = computed(() => {
  const { 品牌, 型号, 驾驶室规格, 底盘规格 } = store.data.车辆.车型;
  return `${品牌} ${型号} · ${驾驶室规格} / ${底盘规格}`;
});

const balance_text = computed(() => formatter.format(store.data.经济.余额));

const location_line = computed(() => {
  const { 国家, 城市 } = store.data.世界.位置;
  return `${国家} · ${城市}`;
});

const weather_info = computed(() => weather_map[store.data.世界.天气.代码] ?? { icon: '🌤️', label: store.data.世界.天气.代码 });
const weather_icon = computed(() => weather_info.value.icon);
const weather_text = computed(() => weather_info.value.label);
const temperature_text = computed(() => `${store.data.世界.天气.气温}°C`);
</script>

<style lang="scss" scoped>
.header-bar {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background:
    radial-gradient(circle at top right, rgba(245, 158, 11, 0.18), transparent 34%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.94), rgba(15, 23, 42, 0.82));
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.header-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.icon {
  font-size: 1.45rem;
}

.title {
  font-size: 1.08rem;
  font-weight: 700;
  color: var(--c-text);
  letter-spacing: 0.03em;
}

.subtitle {
  margin-top: 3px;
  font-size: 0.82rem;
  color: var(--c-muted);
}

.money-card {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(34, 197, 94, 0.22);
  background: rgba(34, 197, 94, 0.08);
}

.money-label {
  font-size: 0.72rem;
  color: #86efac;
}

.money-value {
  font-size: 1rem;
  color: #dcfce7;
  font-weight: 700;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.meta-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: rgba(30, 41, 59, 0.88);
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 12px;
}

.meta-label {
  font-size: 0.72rem;
  color: var(--c-muted);
}

.meta-value {
  font-size: 0.96rem;
  color: var(--c-text);
  font-weight: 700;
}

.meta-sub {
  font-size: 0.78rem;
  color: var(--c-muted);
}

.weather-card .meta-value {
  color: #fde68a;
}

@media (max-width: 720px) {
  .header-main {
    flex-direction: column;
    align-items: stretch;
  }

  .money-card {
    align-items: flex-start;
  }

  .meta-grid {
    grid-template-columns: 1fr;
  }
}
</style>