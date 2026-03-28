<template>
  <div class="faction-layout">
    <div v-for="(info, name) in store.data.派系" :key="name" class="faction-card">
      <!-- 派系标题栏（点击可折叠） -->
      <div class="faction-header" @click="toggle(String(name))">
        <span class="faction-name">{{ name }}</span>
        <i
          :class="expanded.has(String(name)) ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"
          class="faction-toggle"
        ></i>
      </div>

      <!-- 派系内容 -->
      <div v-show="expanded.has(String(name))" class="faction-body">
        <template v-for="(val, key) in info" :key="key">
          <!-- 数值字段 -->
          <StatBar
            v-if="typeof val === 'number'"
            :label="String(key)"
            :value="Number(val)"
            :color="getBarColor(String(name), String(key))"
          />
          <!-- 字符串字段 -->
          <div v-else-if="typeof val === 'string'" class="faction-str">
            <span class="str-key">{{ key }}</span
            ><span class="str-val">{{ val }}</span>
          </div>
          <!-- 布尔字段 -->
          <div v-else-if="typeof val === 'boolean'" class="faction-bool">
            <span class="bool-key">{{ key }}</span>
            <span :class="val ? 'bool-true' : 'bool-false'">{{ val ? '是' : '否' }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDataStore } from '../store';
import StatBar from './StatBar.vue';

const store = useDataStore();

// 默认全部展开
const expanded = ref<Set<string>>(new Set(Object.keys(store.data.派系)));

function toggle(name: string) {
  if (expanded.value.has(name)) {
    expanded.value.delete(name);
  } else {
    expanded.value.add(name);
  }
}

// 根据派系名和字段名决定进度条颜色
function getBarColor(faction: string, key: string): 'crimson' | 'cobalt' | 'sienna' | 'default' {
  if (key.includes('压力') || key.includes('愤怒') || key.includes('风险') || key.includes('开火')) return 'crimson';
  if (key.includes('忠诚') || key.includes('权威') || key.includes('秩序') || key.includes('一致')) return 'cobalt';
  if (key.includes('生存') || key.includes('饥') || key.includes('经济')) return 'sienna';
  return 'default';
}
</script>

<style lang="scss" scoped>
.faction-layout {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.faction-card {
  border: 1.5px solid var(--c-sepia-light);
  background: var(--c-cream);
}

.faction-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: var(--c-ink);
  cursor: pointer;
  user-select: none;

  &:active {
    opacity: 0.85;
  }

  .faction-name {
    font-family: var(--font-headline);
    font-size: 0.85rem;
    font-weight: bold;
    color: var(--c-parchment);
    letter-spacing: 0.04em;
  }

  .faction-toggle {
    color: var(--c-sepia);
    font-size: 0.75rem;
  }
}

.faction-body {
  padding: 7px 10px;
}

.faction-str {
  display: flex;
  gap: 4px;
  font-family: var(--font-body);
  font-size: 0.73rem;
  margin-bottom: 3px;

  .str-key {
    color: var(--c-sepia);
  }
  .str-val {
    color: var(--c-ink);
  }
}

.faction-bool {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-body);
  font-size: 0.73rem;
  margin-bottom: 3px;

  .bool-key {
    color: var(--c-ink);
  }
  .bool-true {
    color: var(--c-crimson);
    font-weight: bold;
  }
  .bool-false {
    color: var(--c-sepia);
  }
}
</style>
