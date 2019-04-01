import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'global', ...(require('/Users/maochichen/Workspace/web-sunmi-store/src/models/global.js').default) });
app.model({ namespace: 'menu', ...(require('/Users/maochichen/Workspace/web-sunmi-store/src/models/menu.js').default) });
app.model({ namespace: 'setting', ...(require('/Users/maochichen/Workspace/web-sunmi-store/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('/Users/maochichen/Workspace/web-sunmi-store/src/models/user.js').default) });
