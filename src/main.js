import Vue from 'vue'
import App from './App.vue'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import Icons from "./components/icons";
import Tables from "./components";

Vue.use(ViewUI);
Vue.component("Icons", Icons)

Vue.use(Tables, { baseUrl: 'http://rapid.idisk.pro:8091', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjEiLCJVc2VyTmFtZSI6ImFkbWluIiwiUGFzc3dvcmQiOiJmM3Y3SVhQVEFqTmt2OFNySU9uKzRnPT0iLCJSb2xlIjoiMSwyLDMsNCIsIm5iZiI6MTU5NTkxNTU3NCwiZXhwIjoxNTk4NTA3NTc0LCJpc3MiOiJkZXZhaWQiLCJhdWQiOiJyYXBpZCJ9.WEiiMPMVxDxP-ryO-nDarNxfLvGOOOkH-ETWCDklNz4' })

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
