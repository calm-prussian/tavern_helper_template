<template>
  <div class="macro-layout">
    <!-- 宏观局势指标 -->
    <div class="section-head">宏观局势</div>

    <div class="gauge-group">
      <div class="gauge-group-label">政 权 · 秩 序</div>
      <StatBar label="政权稳定度" :value="store.data.世界.宏观局势.政权稳定度" color="cobalt" />
      <StatBar label="城市秩序度" :value="store.data.世界.宏观局势.城市秩序度" color="cobalt" />
    </div>

    <div class="gauge-group">
      <div class="gauge-group-label">革 命 · 动 荡</div>
      <StatBar label="群众动员度" :value="store.data.世界.宏观局势.群众动员度" color="crimson" />
      <StatBar label="革命烈度" :value="store.data.世界.宏观局势.革命烈度" color="crimson" />
      <StatBar label="谣言扩散度" :value="store.data.世界.宏观局势.谣言扩散度" color="crimson" />
      <StatBar label="开火风险度" :value="store.data.世界.宏观局势.开火风险度" color="crimson" />
    </div>

    <div class="gauge-group">
      <div class="gauge-group-label">民 生 · 压 迫</div>
      <StatBar label="经济压迫感" :value="store.data.世界.宏观局势.经济压迫感" color="sienna" />
      <StatBar label="饥馑焦虑度" :value="store.data.世界.宏观局势.饥馑焦虑度" color="sienna" />
    </div>

    <!-- 近期事务 -->
    <template v-if="!_.isEmpty(store.data.世界.近期事务)">
      <div class="section-head" style="margin-top: 12px">近期事务</div>
      <div class="recent-affairs">
        <div v-for="(desc, name) in store.data.世界.近期事务" :key="name" class="affair-item">
          <span class="affair-name">【{{ name }}】</span>
          <span class="affair-desc">{{ desc }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';
import StatBar from './StatBar.vue';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.macro-layout {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-head {
  font-family: var(--font-headline);
  font-size: 0.85rem;
  font-weight: bold;
  border-bottom: 2px solid var(--c-ink);
  padding-bottom: 2px;
  margin-bottom: 6px;
  letter-spacing: 0.05em;
}

.gauge-group {
  background: var(--c-cream);
  border: 1px solid var(--c-sepia-light);
  padding: 7px 9px;
  margin-bottom: 6px;

  .gauge-group-label {
    font-family: var(--font-body);
    font-size: 0.68rem;
    color: var(--c-sepia);
    letter-spacing: 0.12em;
    margin-bottom: 5px;
  }
}

.recent-affairs {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.affair-item {
  font-family: var(--font-body);
  font-size: 0.78rem;
  line-height: 1.4;
  background: var(--c-cream);
  border-left: 3px solid var(--c-sepia);
  padding: 4px 8px;

  .affair-name {
    font-weight: bold;
    color: var(--c-ink);
    margin-right: 4px;
  }

  .affair-desc {
    color: var(--c-sepia);
  }
}
</style>
