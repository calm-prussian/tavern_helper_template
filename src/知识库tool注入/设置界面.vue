<template>
  <div class="knowledge-tool-settings">
    <div class="inline-drawer">
      <div class="inline-drawer-toggle inline-drawer-header">
        <b>{{ `知识库 tool 注入` }}</b>
        <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
      </div>
      <div class="inline-drawer-content">
        <div class="knowledge-tool-block flex-container">
          <input v-model="settings.enabled" type="checkbox" />
          <label>{{ `启用` }}</label>
        </div>

        <div class="knowledge-tool-block">
          <label>{{ `注入模式` }}</label>
          <label class="knowledge-tool-radio">
            <input v-model="settings.mode" type="radio" value="auto_tool" />
            {{ `真实工具调用 (AI 主动查询)` }}
          </label>
          <label class="knowledge-tool-radio">
            <input v-model="settings.mode" type="radio" value="force_inject" />
            {{ `强制注入 (每轮请求前伪造查询记录)` }}
          </label>
          <small v-if="settings.mode === 'auto_tool'">{{ `AI 在需要时调用工具查询知识,按标题精确匹配,未命中时返回标题列表供重查。continue/quiet 生成时不生效。AI 不调用则知识不出现。` }}</small>
          <small v-else>{{ `请求发出前将知识伪装为工具查询记录注入,知识每轮必带,不受 AI 判断影响。` }}</small>
        </div>

        <div class="knowledge-tool-block flex-container" v-if="settings.mode === 'auto_tool'">
          <input v-model="settings.tool_hint" type="checkbox" />
          <label>{{ `注入工具提示 (引导 AI 使用工具)` }}</label>
        </div>

        <div class="knowledge-tool-block">
          <label>{{ `条目标题前缀` }}</label>
          <input v-model="settings.title_prefix" class="text_pole width100pct" type="text" :placeholder="`_知识库`" />
          <small>{{ `标题以此前缀开头的条目会被当作知识。` }}</small>
        </div>

        <div class="knowledge-tool-block">
          <label>{{ `Outlet 名` }}</label>
          <input v-model="settings.outlet_name" class="text_pole width100pct" type="text" :placeholder="`_知识库`" />
          <small>{{ `条目位置需设为 Outlet,出口名需与此一致。预设中不要放对应宏。` }}</small>
        </div>

        <div class="knowledge-tool-block">
          <label>{{ `工具名` }}</label>
          <input v-model="settings.tool_name" class="text_pole width100pct" type="text" :placeholder="`knowledge_lookup`" />
        </div>

        <div class="knowledge-tool-block">
          <label>{{ `注入深度 (0 = 末尾)` }}</label>
          <input v-model.number="settings.injection_depth" class="text_pole width100pct" type="number" min="0" />
        </div>

        <div class="knowledge-tool-block flex-container">
          <input v-model="settings.group_multiple" type="checkbox" />
          <label>{{ `合并多个条目为一次 tool 调用` }}</label>
        </div>

        <div class="knowledge-tool-block flex-container">
          <input v-model="settings.inject_on_continue" type="checkbox" />
          <label>{{ `继续生成 (continue) 时注入` }}</label>
        </div>

        <div class="knowledge-tool-block flex-container">
          <input v-model="settings.inject_on_quiet" type="checkbox" />
          <label>{{ `静默生成 (quiet) 时注入` }}</label>
        </div>

        <div class="knowledge-tool-block flex-container">
          <input class="menu_button" type="submit" :value="`校验配置`" @click="handle_validate" />
          <input class="menu_button" type="submit" :value="`诊断扫描`" @click="handle_diagnostic" />
        </div>

        <div v-if="diagRunning" class="knowledge-tool-block">
          <small>{{ `扫描中...` }}</small>
        </div>

        <div v-if="diagResult" class="knowledge-tool-diag">
          <b>{{ `诊断结果` }}</b>
          <div class="knowledge-tool-diag-summary">
            <div>{{ `后端: ${diagResult.mainApi}` }}</div>
            <div>{{ `后处理类型: ${diagResult.postProcessing}` }}</div>
            <div>{{ `世界书数量: ${diagResult.worldbookCount}` }}</div>
            <div>{{ `前缀: ${diagResult.prefix}` }}</div>
            <div>{{ `匹配条目: ${diagResult.matched.length}` }}</div>
          </div>

          <div v-if="diagResult.matched.length > 0">
            <div v-for="e in diagResult.matched" :key="`${e.world}-${e.uid}`" class="knowledge-tool-diag-entry">
              <div class="knowledge-tool-diag-entry-title">{{ e.world }} / {{ e.name }} (uid={{ e.uid }})</div>
              <div class="knowledge-tool-diag-entry-detail">位置: {{ e.position }} | 内容长度: {{ e.contentLength }}</div>
              <div class="knowledge-tool-diag-entry-content">{{ e.contentPreview }}</div>
            </div>
          </div>

          <details class="knowledge-tool-diag-details">
            <summary>{{ `世界书列表 (${diagResult.worldbookNames.length})` }}</summary>
            <div class="knowledge-tool-diag-wblist">{{ diagResult.worldbookNames.join('、') }}</div>
          </details>

          <div v-if="diagResult.issues.length > 0" class="knowledge-tool-diag-issues">
            <b>{{ `问题:` }}</b>
            <div v-for="(issue, i) in diagResult.issues" :key="i" class="knowledge-tool-diag-issue">{{ issue }}</div>
          </div>
        </div>

        <hr class="sysHR" />

        <div class="knowledge-tool-help">
          <b>{{ `使用说明` }}</b>
          <ol>
            <li>{{ `世界书中要当知识注入的条目标题改为以前缀开头。` }}</li>
            <li>{{ `这些条目的位置设为 Outlet,出口名填与上方一致。` }}</li>
            <li>{{ `确认预设里没有对应的 outlet 宏,否则会被原逻辑重复注入。` }}</li>
            <li>{{ `真实工具调用模式下,预设的"提示词后处理类型"建议为 NONE 或 MERGE_TOOLS;强制注入模式需为 NONE / MERGE_TOOLS / SEMI_TOOLS / STRICT_TOOLS。` }}</li>
            <li>{{ `确认后端为 Chat Completion (OpenAI 官方或兼容),且模型支持工具调用。` }}</li>
            <li>{{ `真实工具调用模式下,continue/quiet/impersonate 生成不会注册工具(AI 无法查询),知识不会出现。` }}</li>
          </ol>
        </div>

        <hr class="sysHR" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from './settings';
import { validateConfiguration } from './校验';
import { runDiagnostic, type DiagResult } from './诊断';

const { settings } = storeToRefs(useSettingsStore());

const diagRunning = ref(false);
const diagResult = ref<DiagResult | null>(null);

const handle_validate = () => {
  errorCatched(validateConfiguration)();
};

const handle_diagnostic = async () => {
  diagRunning.value = true;
  try {
    diagResult.value = await errorCatched(runDiagnostic)();
  } finally {
    diagRunning.value = false;
  }
};
</script>

<style scoped>
.knowledge-tool-settings .knowledge-tool-block {
  margin: 8px 0;
}
.knowledge-tool-settings .knowledge-tool-block small {
  display: block;
  opacity: 0.7;
  margin-top: 2px;
  font-size: 0.85em;
}
.knowledge-tool-settings .knowledge-tool-radio {
  display: block;
  margin: 2px 0;
  opacity: 0.9;
}
.knowledge-tool-settings .knowledge-tool-help ol {
  margin: 4px 0 4px 18px;
  padding-left: 4px;
}
.knowledge-tool-settings .knowledge-tool-help li {
  margin: 2px 0;
  font-size: 0.9em;
  opacity: 0.85;
}
.knowledge-tool-settings .knowledge-tool-diag {
  margin: 8px 0;
  padding: 8px;
  border: 1px solid var(--SmartThemeBorderColor, #ccc);
  border-radius: 4px;
  font-size: 0.85em;
}
.knowledge-tool-settings .knowledge-tool-diag-summary {
  margin: 4px 0;
  opacity: 0.85;
}
.knowledge-tool-settings .knowledge-tool-diag-entry {
  margin: 6px 0;
  padding: 4px 6px;
  border-left: 3px solid var(--SmartThemeBorderColor, #ccc);
}
.knowledge-tool-settings .knowledge-tool-diag-entry-title {
  font-weight: bold;
}
.knowledge-tool-settings .knowledge-tool-diag-entry-detail {
  opacity: 0.7;
  font-size: 0.9em;
}
.knowledge-tool-settings .knowledge-tool-diag-entry-content {
  opacity: 0.8;
  font-size: 0.9em;
  white-space: pre-wrap;
  word-break: break-all;
}
.knowledge-tool-settings .knowledge-tool-diag-details {
  margin: 6px 0;
}
.knowledge-tool-settings .knowledge-tool-diag-wblist {
  margin: 4px 0;
  opacity: 0.7;
  word-break: break-all;
}
.knowledge-tool-settings .knowledge-tool-diag-issues {
  margin: 6px 0;
  color: var(--warning, #c80);
}
.knowledge-tool-settings .knowledge-tool-diag-issue {
  margin: 2px 0;
  font-size: 0.9em;
}
</style>