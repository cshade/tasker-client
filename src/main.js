import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import moment from 'moment'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)

Vue.component('detail-display', {
	props: ['task',],
	template: `<ul>
          <li>Description: {{ task.description }}</li>
        </ul>`,
})

var app = new Vue({
	el: '#app',
	data: {
	},
	render: h => h(App)
})
