<template>
  <div class="dashboard-shell">
    <TabNav
      v-model="active_tab"
      :tabs="tabs"
      title="Morgenrot Fracht"
      :subtitle="truck_subtitle"
      :weather="weather_badge"
    />

    <section class="content-area">
      <OverviewPanel v-if="active_tab === 'overview'" />
      <CargoPanel v-else-if="active_tab === 'cargo'" />
      <VehiclePanel v-else-if="active_tab === 'vehicle'" />
      <CabinPanel v-else-if="active_tab === 'cabin'" />
    </section>
  </div>
</template>

<script setup lang="ts">
import CabinPanel from './components/CabinPanel.vue';
import CargoPanel from './components/CargoPanel.vue';
import OverviewPanel from './components/OverviewPanel.vue';
import TabNav from './components/TabNav.vue';
import VehiclePanel from './components/VehiclePanel.vue';
import { useDataStore } from './store';

const store = useDataStore();

const tabs = [
  { id: 'overview', label: '总览' },
  { id: 'cargo', label: '货单' },
  { id: 'vehicle', label: '车况' },
  { id: 'cabin', label: '驾驶室' },
];

const active_tab = useLocalStorage('truck_life.status_bar.active_tab', 'overview');

const truck_subtitle = computed(() => `${store.data.车辆.车型.品牌} ${store.data.车辆.车型.型号}`);

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

const weather_badge = computed(() => {
  const weather = weather_map[store.data.世界.天气.代码] ?? { icon: '🌤️', label: store.data.世界.天气.代码 };
  return {
    date: store.data.世界.时间.日期,
    time: store.data.世界.时间.时刻,
    icon: weather.icon,
    text: weather.label,
    temperature: `${store.data.世界.天气.气温}°C`,
  };
});
</script>

<style lang="scss" scoped>
.dashboard-shell {
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background:
    linear-gradient(180deg, rgba(245, 158, 11, 0.08), transparent 42%),
    linear-gradient(180deg, var(--c-panel), var(--c-bg));
  border: 1px solid rgba(245, 158, 11, 0.28);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: var(--shadow-panel);
}

.content-area {
  padding: 14px;
  min-height: 180px;
}
</style>