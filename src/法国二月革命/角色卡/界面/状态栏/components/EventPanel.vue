<template>
  <div class="event-layout">
    <!-- 革命三日时间线 -->
    <div class="section-head">革命三日</div>
    <div class="timeline">
      <div
        v-for="(info, name) in store.data.事件.革命三日"
        :key="name"
        class="timeline-item"
        :class="getStatusClass(info.状态)"
      >
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="event-header">
            <span class="event-name">{{ formatEventName(String(name)) }}</span>
            <span class="event-status" :class="getStatusClass(info.状态)">{{ info.状态 }}</span>
          </div>
          <!-- 布尔/数值字段（除状态外） -->
          <div class="event-fields">
            <template v-for="(val, key) in info" :key="key">
              <template v-if="key !== '状态'">
                <div v-if="typeof val === 'boolean'" class="event-field-bool">
                  <span class="field-key">{{ key }}：</span>
                  <span :class="val ? 'val-true' : 'val-false'">{{ val ? '✓ 是' : '✗ 否' }}</span>
                </div>
                <div v-else-if="typeof val === 'number'" class="event-field-num">
                  <span class="field-key">{{ key }}：</span>
                  <span class="field-val">{{ val }}</span>
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 后续接口 -->
    <div class="section-head" style="margin-top: 12px">后续接口</div>
    <div class="sequel-list">
      <div
        v-for="(info, name) in store.data.事件.后续接口"
        :key="name"
        class="sequel-item"
        :class="info.状态 === '锁定' ? 'locked' : 'unlocked'"
      >
        <i :class="info.状态 === '锁定' ? 'fa-solid fa-lock' : 'fa-solid fa-lock-open'"></i>
        <span class="sequel-name">{{ name }}</span>
        <span class="sequel-status">{{ info.状态 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

function formatEventName(name: string): string {
  // 将 "02月22日_示威扩散" 格式化为 "02/22 示威扩散"
  return name.replace(/^(\d+月\d+日[^_]*)_/, '$1 · ');
}

function getStatusClass(status: string): string {
  if (status === '已发生') return 'status-done';
  if (status === '进行中') return 'status-active';
  if (status === '锁定') return 'status-locked';
  return 'status-pending';
}
</script>

<style lang="scss" scoped>
.event-layout {
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

/* 时间线 */
.timeline {
  position: relative;
  padding-left: 20px;
  border-left: 2px solid var(--c-sepia-light);
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline-item {
  position: relative;
  padding: 7px 8px 7px 12px;
  margin-bottom: 2px;
  background: var(--c-cream);
  border: 1px solid var(--c-sepia-light);

  &.status-done {
    border-left: 3px solid var(--c-status-done);
  }
  &.status-active {
    border-left: 3px solid var(--c-status-active);
    background: lighten(#d4a017, 45%);
  }
  &.status-pending {
    border-left: 3px solid var(--c-sepia-light);
  }
}

.timeline-dot {
  position: absolute;
  left: -27px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--c-sepia);
  background: var(--c-parchment);

  .status-done & {
    background: var(--c-status-done);
    border-color: var(--c-status-done);
  }
  .status-active & {
    background: var(--c-status-active);
    border-color: var(--c-status-active);
  }
  .status-pending & {
    background: var(--c-parchment);
  }
}

.event-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.event-name {
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--c-ink);
}

.event-status {
  font-family: var(--font-body);
  font-size: 0.68rem;
  padding: 1px 5px;
  border: 1px solid;

  &.status-done {
    color: var(--c-status-done);
    border-color: var(--c-status-done);
  }
  &.status-active {
    color: var(--c-status-active);
    border-color: var(--c-status-active);
  }
  &.status-pending {
    color: var(--c-sepia);
    border-color: var(--c-sepia-light);
  }
  &.status-locked {
    color: var(--c-status-locked);
    border-color: var(--c-status-locked);
  }
}

.event-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.event-field-bool,
.event-field-num {
  font-family: var(--font-body);
  font-size: 0.72rem;

  .field-key {
    color: var(--c-sepia);
  }
  .field-val {
    color: var(--c-ink);
  }
  .val-true {
    color: var(--c-status-done);
    font-weight: bold;
  }
  .val-false {
    color: var(--c-sepia);
  }
}

/* 后续接口 */
.sequel-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sequel-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border: 1.5px solid var(--c-sepia-light);
  font-family: var(--font-body);
  font-size: 0.78rem;

  &.locked {
    background: var(--c-parchment);
    opacity: 0.65;
    color: var(--c-status-locked);
  }

  &.unlocked {
    background: var(--c-cream);
    color: var(--c-ink);
  }

  .sequel-name {
    flex: 1;
    font-weight: bold;
  }

  .sequel-status {
    font-size: 0.68rem;
    color: var(--c-sepia);
  }
}
</style>
