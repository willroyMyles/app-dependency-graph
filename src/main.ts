import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import {Button, Layout, Col, Row } from 'ant-design-vue'
import "ant-design-vue/dist/antd.css"; // or 'ant-design-vue/dist/antd.less'
createApp(App)
.use(store)
// .use()
.use(Button)
.use(Layout)
.use(Col)
.use(Row)
.mount('#app')
