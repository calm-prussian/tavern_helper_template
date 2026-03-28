<template>
  <div class="player-layout">
    <!-- 身份信息 -->
    <div class="section-head">身份</div>
    <div class="identity-card">
      <div class="identity-row">
        <div class="identity-field">
          <span class="id-label">身份</span>
          <span class="id-value">{{ store.data.玩家占位.当前身份 }}</span>
        </div>
        <div class="identity-field">
          <span class="id-label">阶层</span>
          <span class="id-value">{{ store.data.玩家占位.所属阶层 }}</span>
        </div>
      </div>
      <div class="identity-row" style="margin-top: 6px">
        <div class="identity-field">
          <span class="id-label">街区</span>
          <span class="id-value">{{ store.data.玩家占位.当前落点.街区 }}</span>
        </div>
        <div class="identity-field">
          <span class="id-label">位置</span>
          <span class="id-value">{{ store.data.玩家占位.当前落点.具体地点 }}</span>
        </div>
      </div>
    </div>

    <!-- 已知信息面 -->
    <div class="section-head" style="margin-top: 10px">已知信息面</div>
    <div class="info-card">
      <div class="info-row">
        <span class="info-label">识字程度：</span>
        <span class="info-value">{{ store.data.玩家占位.已知信息面.识字程度 }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">消息来源：</span>
        <span v-for="(src, i) in store.data.玩家占位.已知信息面.能接触的消息源" :key="i" class="source-tag">{{
          src
        }}</span>
      </div>
    </div>

    <!-- 个人状态 -->
    <div class="section-head" style="margin-top: 10px">个人状态</div>
    <div class="status-card">
      <StatBar label="体力" :value="store.data.玩家占位.个人状态.体力" color="cobalt" />
      <StatBar label="饥饿度" :value="store.data.玩家占位.个人状态.饥饿度" color="sienna" />
      <StatBar label="负伤度" :value="store.data.玩家占位.个人状态.负伤度" color="crimson" />
      <StatBar label="被注意程度" :value="store.data.玩家占位.个人状态.被注意程度" color="crimson" />
    </div>

    <!-- 行动力 -->
    <div class="section-head" style="margin-top: 10px">行动力</div>
    <div class="action-card">
      <StatBar label="个人影响力" :value="store.data.玩家占位.行动力.个人影响力" color="cobalt" />
      <div class="action-num">
        <span class="num-label">可号召人数</span>
        <span class="num-value">{{ store.data.玩家占位.行动力.可号召人数 }} 人</span>
      </div>

      <!-- 可用资源 -->
      <template v-if="!_.isEmpty(store.data.玩家占位.行动力.可用资源)">
        <div class="resource-title">可用资源</div>
        <div class="resource-list">
          <div v-for="(desc, name) in store.data.玩家占位.行动力.可用资源" :key="name" class="resource-item">
            <span class="resource-name">{{ name }}</span>
            <span class="resource-desc">{{ desc }}</span>
          </div>
        </div>
      </template>

      <!-- 可进入派系网络 -->
      <template v-if="store.data.玩家占位.行动力.可进入派系网络.length">
        <div class="resource-title">可进入派系网络</div>
        <div class="network-list">
          <span v-for="(f, i) in store.data.玩家占位.行动力.可进入派系网络" :key="i" class="network-tag">{{ f }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';
import StatBar from './StatBar.vue';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.player-layout {
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

.identity-card,
.info-card,
.status-card,
.action-card {
  background: var(--c-cream);
  border: 1.5px solid var(--c-sepia-light);
  padding: 8px 10px;
}

.identity-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.identity-field {
  display: flex;
  gap: 5px;
  align-items: baseline;
  font-family: var(--font-body);

  .id-label {
    font-size: 0.7rem;
    color: var(--c-sepia);
    background: var(--c-parchment);
    border: 1px solid var(--c-sepia-light);
    padding: 1px 4px;
  }

  .id-value {
    font-size: 0.8rem;
    color: var(--c-ink);
    font-weight: bold;
  }
}

.info-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  font-family: var(--font-body);
  font-size: 0.75rem;
  margin-bottom: 4px;

  .info-label {
    color: var(--c-sepia);
  }
  .info-value {
    color: var(--c-ink);
  }
}

.source-tag {
  font-size: 0.7rem;
  background: var(--c-parchment);
  border: 1px solid var(--c-sepia-light);
  padding: 1px 5px;
  color: var(--c-ink);
}

.action-num {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-body);
  font-size: 0.75rem;
  padding: 3px 0;
  border-bottom: 1px dashed var(--c-sepia-light);
  margin-bottom: 6px;

  .num-label {
    color: var(--c-sepia);
  }
  .num-value {
    font-weight: bold;
    color: var(--c-ink);
  }
}

.resource-title {
  font-family: var(--font-body);
  font-size: 0.7rem;
  color: var(--c-sepia);
  letter-spacing: 0.06em;
  margin: 7px 0 4px;
}

.resource-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.resource-item {
  display: flex;
  gap: 5px;
  font-family: var(--font-body);
  font-size: 0.73rem;

  .resource-name {
    font-weight: bold;
    color: var(--c-ink);
    background: var(--c-parchment);
    border: 1px solid var(--c-sepia-light);
    padding: 0 4px;
  }

  .resource-desc {
    color: var(--c-sepia);
  }
}

.network-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.network-tag {
  font-family: var(--font-body);
  font-size: 0.72rem;
  background: var(--c-cobalt);
  color: var(--c-parchment);
  padding: 2px 6px;
}
</style>
