<template>
  <!-- <v-container> -->
  <v-col id="nodes" />
  <a-drawer
    :title="node?.name + ' configuration'"
    placement="right"
    :closable="false"
    :visible="drawerVisible"
    width="40%"
    @close="onDrawerClose"
  >

<div v-if="node">

      <ConfigView :nodeid="node.id" ref="updateNode"/>

</div>
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
        <a-button :style="{ marginRight: '8px' }" @click="onClose">
          Cancel
        </a-button>
        <a-button type="primary" @click="onCommit, save()">
          Commit
        </a-button>
        
      </div>
  </a-drawer>
  <!-- </v-container> -->
</template>

<script lang="ts">
import NodeModel from "@/models/node";
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
} from "@vue/runtime-core";
import { VueElement } from "@vue/runtime-dom";
import * as d3 from "d3";
import { store as d3Store } from "../../store/D3Store";
import {store as datastore} from '../../store/DataStoreage'
import ConfigView from '../ConfigView.vue'
export default defineComponent({
  name: "Content",
  components : {
    ConfigView
  },
  setup() {
    const state = reactive({
      drawerVisible: false,
      node : null as NodeModel | null,
    });

    const updateNode = ref()


    const generateNodes = async () => {
      d3Store.initialize(d3.select("#nodes"));
      d3Store.setOnClickCallback(openDrawer);
      d3Store.createLine();
      d3Store.createCircles();
      d3Store.createText();
      d3Store.initializeDrag();
      d3Store.initializeZoom();
      d3Store.onDoubleClick(() => {
        console.log("hello");
      });
      console.log("generated nodes");
    };

    onMounted(() => {
      generateNodes();
    });

    function onDrawerClose() {
      state.drawerVisible = false;
      state.node = null
      
    }

    function openDrawer(node : NodeModel) {
      state.node = node
      state.drawerVisible = true;
    }

    function onCommit(){
      //write changes
    }

    function save(){
      updateNode.value.updateNode();
      onDrawerClose()
    }

    return {
      ...toRefs(state),
      onDrawerClose,
      openDrawer,
      onCommit,
      save,
      updateNode
    };
  },
});
</script>

<style scoped>
.content {
  /* height: 80vh; */
  background-color: white;
}
.link {
  fill: none;
}
</style>
