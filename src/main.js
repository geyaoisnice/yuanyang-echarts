import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from "axios"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { Message } from 'element-ui';
Vue.config.productionTip = false
Vue.use(axios)
Vue.use(ElementUI)
Vue.prototype.$message=Message
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
