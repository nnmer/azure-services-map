import Vue from 'vue'
import App from './App.vue'
import Modal from 'bootstrap-vue/es/components/modal'
import Popover from 'bootstrap-vue/es/components/popover'
import Tooltip from 'bootstrap-vue/es/components/tooltip'
import FormCheckbox from 'bootstrap-vue/es/components/form-checkbox'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/css/style.css'

Vue.use(Modal)
Vue.use(Popover)
Vue.use(Tooltip)
Vue.use(FormCheckbox)
Vue.config.productionTip = false
Vue.config.debug = true

const vm = new Vue({
  render: h => h(App)
}).$mount('#app')
