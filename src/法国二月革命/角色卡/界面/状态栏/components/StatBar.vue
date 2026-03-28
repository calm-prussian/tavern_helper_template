<template>
  <div class="stat-bar">
    <div class="stat-label">{{ label }}</div>
    <div class="stat-track">
      <div class="stat-fill" :class="color" :style="{ width: value + '%' }"></div>
    </div>
    <div class="stat-value">{{ value }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: number;
  color?: 'crimson' | 'cobalt' | 'sienna' | 'default';
}>();
</script>

<style lang="scss" scoped>
.stat-bar {
  display: grid;
  grid-template-columns: 6em 1fr 2.2em;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.stat-label {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--c-ink);
  white-space: nowrap;
}

.stat-track {
  height: 8px;
  background: var(--c-sepia-light);
  border: 1px solid var(--c-sepia);
  position: relative;
  overflow: hidden;
}

.stat-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  transition: width 0.3s ease;

  &.crimson {
    background: var(--c-crimson);
  }
  &.cobalt {
    background: var(--c-cobalt);
  }
  &.sienna {
    background: var(--c-sienna);
  }
  &.default {
    background: var(--c-sepia);
  }
}

.stat-value {
  font-family: var(--font-body);
  font-size: 0.72rem;
  color: var(--c-sepia);
  text-align: right;
}
</style>
