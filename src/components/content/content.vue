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
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
} from "@vue/runtime-core";
import * as d3 from "d3";
import {store as d3Store} from '../../store/D3Storage'

export default defineComponent({
  name: "Content",
  setup() {
    let state = reactive({
      currentNode: null as d3.Selection<any, unknown, null, undefined> | null,
      drawerVisible : false
    });

    // const d3Store = useThisStore()

    

    const generateNodes = async () => {


    d3Store.initialize(d3.select("#nodes"))
    d3Store.setOnClickCallback(openDrawer)
    d3Store.createLine()
    d3Store.createCircles({node : null})
    d3Store.createText()
    d3Store.initializeDrag()
    d3Store.initializeZoom()
    d3Store.onDoubleClick(()=>{
      console.log("hello")
    })
  
          



      

      


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
