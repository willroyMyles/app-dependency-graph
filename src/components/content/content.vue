<template>

  <a-col id="nodes" />
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
export default defineComponent({
  name: "Content",
  components : {
  },
  setup() {
    const state = reactive({
      drawerVisible: false,
      node : null as NodeModel | null,
    });

    const updateNode = ref()


    const generateNodes = async () => {
      d3Store.initialize(d3.select("#nodes"));
      d3Store.createGraph()
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
