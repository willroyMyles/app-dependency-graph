<template>
  <!-- <v-container> -->
  <v-col id="nodes" />
  <a-drawer
    title="basic drawer"
    placement="right"
    :closable="false"
    :visible="drawerVisible"
    @close="onDrawerClose"
  >
    hello world
    {{state}}
    <div v-if="currentNode != null"> {{currentNode.name}}</div>
  </a-drawer>
  <!-- </v-container> -->
</template>

<script lang="ts">
import {  useThisStore } from "@/store/d3Store";
import { useDataStore } from "@/store/dataStore";
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
} from "@vue/runtime-core";
import * as d3 from "d3";
import NodeModel from "./../../models/node";

export default defineComponent({
  name: "Content",
  setup() {
    let state = reactive({
      currentNode: null as d3.Selection<any, unknown, null, undefined> | null,
      drawerVisible : false
    });

    const d3Store = useThisStore()
    const dataStore = useDataStore()

    const generateNodes = async () => {


    d3Store.commit("initialize", d3.select("#nodes"))
    dataStore.commit("initalize")
     var links = await d3Store.dispatch("getLinks")
     d3Store.commit("createLine", links)
     d3Store.commit("createCircles", openDrawer)
     d3Store.commit("createText")
     d3Store.commit("initializeDrag")
     d3Store.commit("initializeZoom")
          



      

      


      console.log("generated nodes");

    //   function handleDoubleClick(e, i){
    //     console.log(e, i);
        
    //   //create new node
    //   var node = new NodeModel()
    //   node.x = e.x
    //   node.y = e.y

    //   //add node to list
    //   state.nodes.push(node)

    //   //refresh svg
    //   // svg.remove()
    //   generateNodes()

    // }
    }

    onMounted(() => {
      generateNodes();
    });

    function onDrawerClose(){
      console.log("up");
      
      state.drawerVisible = false;
    }

    function openDrawer(){
      // state.currentNode = i;
      state.drawerVisible = true;
    }

    

    return {
      ...toRefs(state),
      onDrawerClose,
      openDrawer
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
