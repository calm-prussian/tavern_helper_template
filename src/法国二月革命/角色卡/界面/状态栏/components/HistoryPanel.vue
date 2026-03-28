<template>
  <div class="history-layout">
    <!-- 默认历史航道 -->
    <div class="section-head">默认历史航道</div>
    <div class="railway-nodes">
      <div
        v-for="(val, key) in store.data.历史分歧.默认历史航道"
        :key="key"
        class="railway-node"
        :class="val ? 'node-on' : 'node-off'"
      >
        <span class="node-check">{{ val ? '✓' : '✗' }}</span>
        <span class="node-label">{{ key }}</span>
      </div>
    </div>

    <!-- 当前偏移 -->
    <div class="section-head" style="margin-top: 10px">当前偏移</div>
    <div class="offset-block" :class="store.data.历史分歧.当前偏移.是否进入新世界线 ? 'newline-alert' : ''">
      <div class="offset-top">
        <span class="offset-label">偏移度</span>
        <span class="offset-value">{{ store.data.历史分歧.当前偏移.偏移度 }}</span>
        <span v-if="store.data.历史分歧.当前偏移.是否进入新世界线" class="newline-badge">⚠ 新世界线</span>
      </div>
      <div class="offset-track">
        <div class="offset-fill" :style="{ width: Math.min(store.data.历史分歧.当前偏移.偏移度, 100) + '%' }"></div>
      </div>
      <div v-if="store.data.历史分歧.当前偏移.偏移来源.length" class="offset-sources">
        <span class="sources-label">来源：</span>
        <span v-for="(s, i) in store.data.历史分歧.当前偏移.偏移来源" :key="i" class="source-tag">{{ s }}</span>
      </div>
    </div>

    <!-- 历史锚点压力 -->
    <div class="section-head" style="margin-top: 10px">历史锚点压力</div>
    <div class="anchor-block">
      <StatBar
        v-for="(val, key) in store.data.历史分歧.历史锚点压力"
        :key="key"
        :label="String(key)"
        :value="Number(val)"
        color="crimson"
      />
    </div>

    <!-- 已改写节点 -->
    <template v-if="!_.isEmpty(store.data.历史分歧.已改写节点)">
      <div class="section-head" style="margin-top: 10px">已改写节点</div>
      <div class="rewritten-list">
        <div v-for="(desc, node) in store.data.历史分歧.已改写节点" :key="node" class="rewritten-item">
          <span class="rewritten-node">【{{ node }}】</span>
          <span class="rewritten-desc">{{ desc }}</span>
        </div>
      </div>
    </template>

    <!-- 潜在改写预警 -->
    <template v-if="store.data.历史分歧.潜在改写预警.length && store.data.历史分歧.潜在改写预警[0] !== '无'">
      <div class="section-head" style="margin-top: 10px">潜在改写预警</div>
      <div class="warning-list">
        <div v-for="(w, i) in store.data.历史分歧.潜在改写预警" :key="i" class="warning-item">
          <i class="fa-solid fa-triangle-exclamation"></i> {{ w }}
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
.history-layout {
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

/* 默认历史航道节点 */
.railway-nodes {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.railway-node {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: 1.5px solid;
  font-family: var(--font-body);
  font-size: 0.75rem;

  &.node-on {
    border-color: var(--c-cobalt);
    background: rgba(26, 58, 107, 0.08);
    color: var(--c-cobalt);
  }

  &.node-off {
    border-color: var(--c-sepia-light);
    background: var(--c-parchment);
    color: var(--c-sepia);
    text-decoration: line-through;
  }

  .node-check {
    font-size: 0.8rem;
    font-weight: bold;
  }
}

/* 偏移块 */
.offset-block {
  background: var(--c-cream);
  border: 1.5px solid var(--c-sepia-light);
  padding: 8px 10px;

  &.newline-alert {
    border-color: var(--c-crimson);
    background: rgba(139, 26, 26, 0.05);
  }

  .offset-top {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 6px;

    .offset-label {
      font-family: var(--font-body);
      font-size: 0.75rem;
      color: var(--c-sepia);
    }

    .offset-value {
      font-family: var(--font-headline);
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--c-crimson);
    }

    .newline-badge {
      font-family: var(--font-body);
      font-size: 0.72rem;
      background: var(--c-crimson);
      color: var(--c-parchment);
      padding: 2px 6px;
    }
  }

  .offset-track {
    height: 8px;
    background: var(--c-sepia-light);
    border: 1px solid var(--c-sepia);
    position: relative;
    overflow: hidden;
    margin-bottom: 5px;

    .offset-fill {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      background: var(--c-crimson);
      transition: width 0.3s ease;
    }
  }

  .offset-sources {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    font-family: var(--font-body);
    font-size: 0.72rem;

    .sources-label {
      color: var(--c-sepia);
    }
    .source-tag {
      background: var(--c-parchment);
      border: 1px solid var(--c-sepia-light);
      padding: 1px 4px;
      color: var(--c-ink);
    }
  }
}

/* 锚点压力 */
.anchor-block {
  background: var(--c-cream);
  border: 1px solid var(--c-sepia-light);
  padding: 7px 10px;
}

/* 已改写节点 */
.rewritten-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rewritten-item {
  font-family: var(--font-body);
  font-size: 0.75rem;
  background: var(--c-cream);
  border-left: 3px solid var(--c-cobalt);
  padding: 4px 8px;
  line-height: 1.4;

  .rewritten-node {
    font-weight: bold;
    color: var(--c-cobalt);
    margin-right: 4px;
  }
  .rewritten-desc {
    color: var(--c-sepia);
  }
}

/* 预警 */
.warning-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.warning-item {
  font-family: var(--font-body);
  font-size: 0.75rem;
  background: rgba(212, 160, 23, 0.1);
  border-left: 3px solid var(--c-status-active);
  padding: 4px 8px;
  color: var(--c-ink);

  i {
    color: var(--c-status-active);
    margin-right: 4px;
  }
}
</style>
