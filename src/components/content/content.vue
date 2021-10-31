<template>
  <!-- <v-container> -->
  <v-col id="nodes" />
  <a-drawer
    :title="node?.name + ' configuration'"
    placement="right"
    :closable="false"
    :visible="drawerVisible"
    @close="onDrawerClose"
  >
    hello world
    {{ node?.name }}

<div v-if="node">

    <div v-for="item in Object.entries(node)" :key="item.key">
      {{item[0]}} : {{item[1]}}
    </div>
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
  toRefs,
} from "@vue/runtime-core";
import * as d3 from "d3";
import { store as d3Store } from "../../store/D3Store";
import {store as datastore} from '../../store/DataStoreage'

export default defineComponent({
  name: "Content",
  setup() {
    let state = reactive({
      drawerVisible: false,
      node : null as NodeModel | null
    });

    // const d3Store = useThisStore()
    

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
    }

    function openDrawer(node : NodeModel) {
      console.log(node);
      state.node = node
      state.drawerVisible = true;
    }

    return {
      ...toRefs(state),
      onDrawerClose,
      openDrawer,
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
