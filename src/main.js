import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/css/style.css'

Vue.use(BootstrapVue)
Vue.config.productionTip = false
Vue.config.debug = true

const vm = new Vue({
  render: h => h(App)
}).$mount('#app')

vm.$on('click::at::page', function(event){
  console.warn(event)
  vm.$root.$emit('bv::hide::popover')
})
