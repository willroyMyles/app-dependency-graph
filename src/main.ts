import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import {Button, Layout, Col, Row, Drawer } from 'ant-design-vue'
import "ant-design-vue/dist/antd.css"; // or 'ant-design-vue/dist/antd.less'

import D3Store, { key} from "./store/d3Store"
import DataStore, { key as dataKey} from "./store/dataStore"

createApp(App)
.use(store)
.use(D3Store, key)
.use(DataStore, dataKey)
// .use()
.use(Button)
.use(Layout)
.use(Col)
.use(Row)
.use(Drawer)
.mount('#app')
