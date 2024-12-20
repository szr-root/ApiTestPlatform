import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// elementplus相关的库导入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 导入暗黑模式主题
import 'element-plus/theme-chalk/dark/css-vars.css'
// 导入项目的全局css样式文件
import './style/global.scss'

import pinia from '@/stores/index'

// ================================解决element-plus----表格组件引发的异常解决方案------start----------
const debounce = (fn, delay) => {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  }
}
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver{
  constructor(callback) {
    callback = debounce(callback, 16);
    super(callback);
  }
}
// ================================解决element-plus----表格组件引发的异常解决方案-----end-----------


//  创建一个应用
const app = createApp(App)
// 注册pinia
app.use(pinia)

// @ 注册elementplus
app.use(ElementPlus, {
	locale: zhCn,
})
// @ 注册elementplus的图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}



app.use(router).mount('#app')