import { createScriptIdDiv, teleportStyle } from '@util/script';
import { useSettingsStore } from './settings';
import { startCollecting } from './收集知识';
import { startInjecting } from './注入tool消息';
import { validateConfiguration } from './校验';
import 设置界面 from './设置界面.vue';

$(() => {
  const pinia = createPinia();
  setActivePinia(pinia);

  const { settings } = useSettingsStore();
  if (settings.enabled) {
    errorCatched(validateConfiguration)();
  }

  const collectRet = startCollecting();
  const injectRet = startInjecting();

  const app = createApp(设置界面).use(pinia);
  const $app = createScriptIdDiv().appendTo('#extensions_settings2');
  app.mount($app[0]);
  const { destroy } = teleportStyle();

  console.info('[知识库tool注入] 脚本已加载');
  toastr.success('知识库 tool 注入脚本已加载,设置面板在扩展设置区。', '知识库tool注入');

  $(window).on('pagehide', () => {
    collectRet.stop();
    injectRet.stop();
    app.unmount();
    $app.remove();
    destroy();
    console.info('[知识库tool注入] 脚本已卸载');
  });
});