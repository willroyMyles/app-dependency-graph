import { createApp } from 'vue'
// import App from './App.vue'
import App from './components/views/Welcome.vue'
import store from './store'
import {Button, Layout, Col, Row, Drawer, Select , Input, Collapse,Card } from 'ant-design-vue'
import "ant-design-vue/dist/antd.css"; // or 'ant-design-vue/dist/antd.less'


createApp(App)
.use(store)
.use(Button)
.use(Layout)
.use(Col)
.use(Row)
.use(Drawer)
.use(Select)
.use(Input)
.use(Card)
.use(Collapse)
.mount('#app')
