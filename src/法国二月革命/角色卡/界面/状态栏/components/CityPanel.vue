<template>
  <div class="city-layout">
    <!-- 巴黎总体 -->
    <div class="section-head">巴黎总体</div>
    <div class="overview-card">
      <div class="tag-row">
        <span class="tag-item"><i class="fa-solid fa-road"></i> {{ store.data.城市.巴黎总体.通行状态 }}</span>
        <span class="tag-item"><i class="fa-solid fa-lightbulb"></i> {{ store.data.城市.巴黎总体.夜间照明 }}</span>
        <span class="tag-item"
          ><i class="fa-solid fa-people-group"></i> 集会密度：{{ store.data.城市.巴黎总体.街头集会密度 }}</span
        >
      </div>
      <StatBar label="交通受阻度" :value="store.data.城市.巴黎总体.交通受阻度" color="crimson" />
      <StatBar label="路障扩散趋势" :value="store.data.城市.巴黎总体.路障扩散趋势" color="crimson" />
    </div>

    <!-- 核心地点 -->
    <div class="section-head" style="margin-top: 10px">核心地点</div>
    <div class="locations-grid">
      <div v-for="(info, name) in store.data.城市.核心地点" :key="name" class="location-card">
        <div class="location-name">{{ name }}</div>
        <div class="location-ctrl">{{ info.控制方 }}</div>
        <div class="location-stats">
          <template v-for="(val, key) in info" :key="key">
            <template v-if="key !== '控制方'">
              <!-- 布尔字段 -->
              <div v-if="typeof val === 'boolean'" class="location-bool">
                <span class="bool-key">{{ key }}</span>
                <span :class="val ? 'bool-true' : 'bool-false'">{{ val ? '是' : '否' }}</span>
              </div>
              <!-- 数值字段 -->
              <div v-else-if="typeof val === 'number'" class="location-num">
                <StatBar :label="String(key)" :value="Number(val)" color="default" />
              </div>
              <!-- 字符串字段 -->
              <div v-else class="location-str">
                <span class="str-key">{{ key }}</span
                ><span class="str-val">{{ val }}</span>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>

    <!-- 街区 -->
    <div class="section-head" style="margin-top: 10px">街区</div>
    <div class="districts-list">
      <div v-for="(info, name) in store.data.城市.街区" :key="name" class="district-card">
        <div class="district-name">{{ name }}</div>
        <template v-for="(val, key) in info" :key="key">
          <!-- 口号数组 -->
          <div v-if="Array.isArray(val) && key === '主要口号'" class="slogan-row">
            <span class="slogan-label">口号：</span>
            <span v-for="(s, i) in val" :key="i" class="slogan-tag">{{ s }}</span>
          </div>
          <!-- 数值 -->
          <div v-else-if="typeof val === 'number'">
            <StatBar :label="String(key)" :value="Number(val)" color="crimson" />
          </div>
          <!-- 字符串 -->
          <div v-else-if="typeof val === 'string'" class="district-str">
            <span class="str-key">{{ key }}</span
            ><span class="str-val">{{ val }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';
import StatBar from './StatBar.vue';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.city-layout {
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

.overview-card {
  background: var(--c-cream);
  border: 1px solid var(--c-sepia-light);
  padding: 8px 10px;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 7px;

  .tag-item {
    font-family: var(--font-body);
    font-size: 0.73rem;
    background: var(--c-parchment);
    border: 1px solid var(--c-sepia-light);
    padding: 2px 6px;
    color: var(--c-ink);
  }
}

.locations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 7px;
}

.location-card {
  background: var(--c-cream);
  border: 1.5px solid var(--c-sepia-light);
  padding: 7px 8px;

  .location-name {
    font-family: var(--font-headline);
    font-size: 0.82rem;
    font-weight: bold;
    border-bottom: 1px solid var(--c-sepia-light);
    padding-bottom: 3px;
    margin-bottom: 4px;
  }

  .location-ctrl {
    font-family: var(--font-body);
    font-size: 0.7rem;
    color: var(--c-sepia);
    margin-bottom: 5px;
  }
}

.location-bool {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-body);
  font-size: 0.72rem;
  margin-bottom: 2px;

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

.location-str,
.district-str {
  display: flex;
  gap: 4px;
  font-family: var(--font-body);
  font-size: 0.72rem;
  margin-bottom: 2px;

  .str-key {
    color: var(--c-sepia);
  }
  .str-val {
    color: var(--c-ink);
  }
}

.districts-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.district-card {
  background: var(--c-cream);
  border: 1.5px solid var(--c-sepia-light);
  padding: 7px 10px;

  .district-name {
    font-family: var(--font-headline);
    font-size: 0.82rem;
    font-weight: bold;
    border-bottom: 1px solid var(--c-sepia-light);
    padding-bottom: 3px;
    margin-bottom: 5px;
  }
}

.slogan-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
  font-family: var(--font-body);

  .slogan-label {
    font-size: 0.7rem;
    color: var(--c-sepia);
  }

  .slogan-tag {
    font-size: 0.7rem;
    background: var(--c-crimson);
    color: var(--c-parchment);
    padding: 1px 5px;
  }
}
</style>
