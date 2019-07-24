import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import moment from 'moment'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(moment)
Vue.use(BootstrapVue)

Vue.component('detail-display', {
	props: ['task',],
	template: `<ul>
          <li>Task No.: {{ task.id }}</li>
          <li>Description: {{ task.description }}</li>
          <li>Due: {{ task.due }}</li>
        </ul>`,
})

var app = new Vue({
	el: '#app',
	data: {
	},
	render: h => h(App)
})
