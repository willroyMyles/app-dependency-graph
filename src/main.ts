import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import {Button, Layout, Col, Row, Drawer, Select } from 'ant-design-vue'
import "ant-design-vue/dist/antd.css"; // or 'ant-design-vue/dist/antd.less'


createApp(App)
.use(store)
.use(Button)
.use(Layout)
.use(Col)
.use(Row)
.use(Drawer)
.use(Select)
.mount('#app')
