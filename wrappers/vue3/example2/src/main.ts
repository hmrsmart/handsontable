import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import {HotTable, HotColumn} from '../../dist/vue-handsontable'

createApp(App)
  // .use(store)
  .mount('#app')
