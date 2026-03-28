<template>
  <div class="header-card">
    <!-- 顶部三色旗装饰条 -->
    <div class="tricolor-bar">
      <div class="tc-r"></div>
      <div class="tc-w"></div>
      <div class="tc-b"></div>
    </div>

    <!-- 标题行 -->
    <div class="header-main">
      <div class="revolution-stage">{{ store.data.世界.当前革命阶段 }}</div>
      <div class="time-block">
        <span class="time-label">时</span>
        <span class="time-value">{{ store.data.世界.当前时间 }}</span>
        <span class="date-phase">{{ store.data.世界.当前日期阶段 }}</span>
      </div>
    </div>

    <!-- 天气行 -->
    <div class="weather-row">
      <span class="weather-item"><i class="fa-solid fa-temperature-half"></i> {{ store.data.世界.天气.体感 }}</span>
      <span class="weather-sep">·</span>
      <span class="weather-item"><i class="fa-solid fa-cloud"></i> {{ store.data.世界.天气.天空 }}</span>
      <span class="weather-sep">·</span>
      <span class="weather-item"><i class="fa-solid fa-wind"></i> {{ store.data.世界.天气.风势 }}</span>
      <span class="weather-sep">·</span>
      <span class="weather-item"><i class="fa-solid fa-droplet"></i> {{ store.data.世界.天气.降水 }}</span>
    </div>

    <!-- 叙事焦点 -->
    <div v-if="store.data.世界.当前主叙事焦点.length" class="focus-block">
      <div class="focus-title">── 当前焦点 ──</div>
      <div v-for="(focus, i) in store.data.世界.当前主叙事焦点" :key="i" class="focus-item">
        <span class="focus-bullet">▶</span> {{ focus }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.header-card {
  background: var(--c-ink);
  color: var(--c-parchment);
  font-family: var(--font-headline);
}

.tricolor-bar {
  display: flex;
  height: 5px;

  .tc-r {
    flex: 1;
    background: var(--c-tricolor-r);
  }
  .tc-w {
    flex: 1;
    background: var(--c-tricolor-w);
  }
  .tc-b {
    flex: 1;
    background: var(--c-tricolor-b);
  }
}

.header-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px 4px;
  border-bottom: 1px solid var(--c-sepia);

  .revolution-stage {
    font-size: 1rem;
    font-weight: bold;
    letter-spacing: 0.04em;
    color: var(--c-parchment);
  }

  .time-block {
    display: flex;
    align-items: center;
    gap: 5px;
    font-family: var(--font-body);
    font-size: 0.78rem;
    color: var(--c-sepia);

    .time-label {
      background: var(--c-sepia);
      color: var(--c-ink);
      padding: 1px 3px;
      font-size: 0.68rem;
    }

    .time-value {
      color: var(--c-parchment);
    }

    .date-phase {
      font-size: 0.7rem;
      color: var(--c-sepia);
    }
  }
}

.weather-row {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--c-sepia);
  border-bottom: 1px solid rgba(158, 136, 102, 0.3);

  .weather-sep {
    color: rgba(158, 136, 102, 0.5);
  }

  .weather-item {
    white-space: nowrap;
  }
}

.focus-block {
  padding: 6px 12px 8px;
  font-family: var(--font-body);

  .focus-title {
    font-size: 0.68rem;
    color: var(--c-sepia);
    text-align: center;
    letter-spacing: 0.1em;
    margin-bottom: 4px;
  }

  .focus-item {
    font-size: 0.8rem;
    color: var(--c-parchment);
    line-height: 1.4;
    padding: 1px 0;
  }

  .focus-bullet {
    color: var(--c-crimson);
    font-size: 0.6rem;
    margin-right: 3px;
  }
}
</style>
