<template>
  <a-layout>
    <!-- <a-layout-header>header</a-layout-header> -->
    <a-layout-content>
      <Content />
    </a-layout-content>
    <div id="zoom" class="zoom">{{ }}</div>
    <a-layout-sider :width="width" height="100%" style="background: white">
      <div v-if="node == null">
        <SideBarMenu />
      </div>
      <div v-else>
        <div>
          <span>{{ node.name }} configuration</span>
        </div>
        <hr />
        <ConfigView :nodeProp="node" :disabled="!editing" ref="updateNode" :key="node.id" />
        <div
          :style="{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            zIndex: 1,
          }"
        >
          <a-row justify="space-around" v-if="editing">
            <a-button :style="{ marginRight: '8px' }" @click="cancel">Cancel</a-button>
            <a-button type="primary" @click="commit">Commit</a-button>
          </a-row>
          <a-row justify="center" v-else>
            <a-col>
              <a-button type="secondary" @click="handleEditing">Edit</a-button>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-layout-sider>
  </a-layout>
</template>

<script lang="ts">
import {
  Component,
  computed,
  defineComponent,
  reactive,
  ref,
  toRefs,
} from "vue";
import Content from "./components/content/content.vue";
import NodeModel from "./models/node";
import ConstantsStore from "./store/ConstantsStore";
import ConfigView from "./components/ConfigView.vue";
import { store as d3Store } from "./store/D3Store";
import SideBarMenu from "./components/SideBarMenu.vue";

export default defineComponent({
  name: "App",
  components: {
    Content,
    ConfigView,
    SideBarMenu,
  },

  setup() {
    const state = reactive({
      node: null as NodeModel | null,
      editing: false,
    });

    const updateNode = ref<typeof ConfigView>();

    d3Store.setOnNodeClickCallback(onSelect);
    d3Store.setOnSvgClickCallback(onDeselect);

    function onSelect(e: any, node: NodeModel) {
      state.node = node;
      state.editing = false
    }

    function onDeselect() {
      state.node = null;
    }

    function commit() {
      updateNode.value!.updateNode();
    }

    function cancel() {
      updateNode.value!.reset();
      state.editing = false;
    }

    function handleEditing() {
      state.editing = true;
    }

    return {
      width: ConstantsStore.sideWidth,
      ...toRefs(state),
      updateNode,
      commit,
      cancel,
      handleEditing,
    };
  },
});
</script>

<style>

.d3-context{
	position: absolute;
	display: none;
	background-color: #f2f2f2;
	border-radius: 4px;

	font-family: Arial, sans-serif;
	font-size: 14px;
	min-width: 150px;
	border: 1px solid #d4d4d4;

	z-index:1200;
}

.context-menu-ul {
	list-style-type: none;
	margin: 4px 0px;
	padding: 0px;
	cursor: default;
}

.d3-context-menu-list-item{
	padding: 4px 16px; 
}

.d3-context-menu-list-item:hover {
	background-color: #4677f8;
	color: #fefefe;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.sidebar {
  background: #fff;
  color: red;
  background-color: red;
}

.zoom {
  width: 100;
  height: 100;
  position: absolute;
  left: 10px;
  bottom: 10px;
  z-index: 1000;
}
</style>
