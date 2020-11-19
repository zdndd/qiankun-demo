import { addGlobalUncaughtErrorHandler, registerMicroApps, start } from 'qiankun';

/**
 * 注册微应用
 * 第一个参数 - 微应用的注册信息
 * 第二个参数 - 全局生命周期钩子
 */
registerMicroApps(
  [
    {
      name: '111',
      entry: '//localhost:4201',
      container: '#subapp-viewport',
      // loader,
      activeRule: '/angular10',
    },
    {
      name: 'angular8',
      entry: '//localhost:1234',
      container: '#subapp-viewport',
      // loader,
      activeRule: '/angular8',
    },
    {
      name: 'crystal',
      entry: '//localhost:4200',
      container: '#subapp-viewport',
      // loader,
      activeRule: '/crystal',
    },
  ],
  {
    // mirco 生命周期钩子 - 加载前
    beforeLoad: (app: any) => {
      // 加载子应用前，加载进度条
      //   NProgress.start();
      // console.log('before load', app.name);
      return Promise.resolve();
    },
    // mirco 生命周期钩子 - 挂载后
    afterMount: (app: any) => {
      // 加载子应用前，进度条加载完成
      //   NProgress.done();
      // console.log('after mount', app.name);
      return Promise.resolve();
    },
  },
);

/**
 * 添加全局的未捕获异常处理器
 */
addGlobalUncaughtErrorHandler((event: Event | string) => {
  console.error(event);
  const { message: msg } = event as any;
  // 加载失败时提示
  if (msg && msg.includes('died in status LOADING_SOURCE_CODE')) {
    console.error('微应用加载失败，请检查应用是否可运行', msg);
  }
});

// 导出 mirco 的启动函数
export default start;
