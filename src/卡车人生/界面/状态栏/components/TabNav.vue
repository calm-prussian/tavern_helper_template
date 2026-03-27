<template>
  <header class="topbar">
    <div class="topbar-head">
      <div class="brand">
        <span class="icon">🚚</span>
        <div class="brand-text">
          <div class="title">{{ props.title }}</div>
          <div v-if="props.subtitle" class="subtitle">{{ props.subtitle }}</div>
        </div>
      </div>

      <div class="weather" v-if="props.weather">
        <div class="weather-line weather-line-main">
          <span class="weather-main">{{ props.weather.icon }} {{ props.weather.text }}</span>
          <span class="weather-temp">{{ props.weather.temperature }}</span>
        </div>
        <div class="weather-line weather-line-meta">
          <span class="weather-meta">{{ props.weather.date }} · {{ props.weather.time }}</span>
        </div>
      </div>
    </div>

    <nav class="tabs">
      <button
        v-for="tab in props.tabs"
        :key="tab.id"
        class="tab-button"
        :class="{ active: model === tab.id }"
        :aria-expanded="model === tab.id"
        @click="model = tab.id"
      >
        {{ tab.label }}
      </button>
    </nav>
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  subtitle?: string;
  tabs: { id: string; label: string }[];
  weather?: {
    date: string;
    time: string;
    icon: string;
    text: string;
    temperature: string;
  };
}>();

const model = defineModel<string>({ required: true });
</script>

<style lang="scss" scoped>
.topbar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 14px;
  background:
    radial-gradient(circle at top right, rgba(245, 158, 11, 0.18), transparent 45%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.94), rgba(15, 23, 42, 0.88));
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
}

.topbar-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.icon {
  font-size: 1.3rem;
}

.brand-text {
  min-width: 0;
}

.title {
  color: var(--c-text);
  font-size: 1.02rem;
  font-weight: 700;
  white-space: nowrap;
}

.subtitle {
  color: var(--c-muted);
  font-size: 0.75rem;
  margin-top: 2px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.tabs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  background: rgba(15, 23, 42, 0.56);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
}

.weather {
  justify-self: end;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  padding: 7px 10px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.58);
  white-space: nowrap;
}

.weather-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.weather-meta {
  color: var(--c-muted);
  font-size: 0.78rem;
}

.weather-main {
  color: #fde68a;
  font-size: 0.82rem;
  font-weight: 700;
}

.weather-temp {
  color: var(--c-muted);
  font-size: 0.78rem;
}

.tab-button {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--c-muted);
  padding: 9px 12px;
  cursor: pointer;
  font-size: 0.84rem;
  letter-spacing: 0.04em;
  transition: 0.2s ease;
  border-right: 1px solid rgba(148, 163, 184, 0.15);
  white-space: nowrap;
  text-align: center;
}

.tab-button:last-child {
  border-right: none;
}

.tab-button:hover {
  color: var(--c-text);
  background: rgba(245, 158, 11, 0.08);
}

.tab-button.active {
  color: var(--c-text);
  background:
    linear-gradient(180deg, rgba(245, 158, 11, 0.28), rgba(245, 158, 11, 0.12)),
    rgba(15, 23, 42, 0.72);
  box-shadow: inset 0 -1px 0 var(--c-accent);
}

@media (max-width: 860px) {
  .topbar-head {
    align-items: flex-start;
  }

  .weather {
    justify-self: end;
    align-items: flex-end;
    padding: 6px 9px;
    max-width: 100%;
  }

  .weather-line-main {
    justify-content: flex-end;
  }

  .weather-line-meta {
    justify-content: flex-end;
  }

  .weather-main {
    font-size: 0.78rem;
  }

  .weather-temp,
  .weather-meta {
    font-size: 0.72rem;
  }

  .tab-button {
    text-align: center;
    padding: 10px 6px;
    font-size: 0.8rem;
  }

  .tab-button:nth-child(2n) {
    border-right: none;
  }

  .tab-button:nth-child(-n + 2) {
    border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  }
}

@media (max-width: 560px) {
  .topbar-head {
    flex-direction: column;
    gap: 8px;
  }

  .weather {
    align-self: flex-end;
  }
}
</style>