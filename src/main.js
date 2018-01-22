// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router';
import FastClick from 'fastclick';
import VueLazyload from 'vue-lazyload';
import 'common/less/index.less';

Vue.config.productionTip = false;

// 取消移动端300ms延迟
FastClick.attach(document.body);

// VueLazyload懒加载，支持require方法
Vue.use(VueLazyload, {
  error: require('common/image/default.png'),
  loading: require('common/image/default.png')
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
