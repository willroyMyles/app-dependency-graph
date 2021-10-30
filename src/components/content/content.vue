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
      nodes: [
        new NodeModel("esif"),
        new NodeModel("web admin"),
        new NodeModel("Reward service"),
      ],
      drawerVisible : false
    });

    const d3Store = useThisStore()
    const dataStore = useDataStore()

    state.nodes[1].downStream.push(state.nodes[2].id);
    state.nodes[0].downStream.push(state.nodes[2].id);
    state.nodes[1].downStream.push(state.nodes[0].id);

    const generateNodes = async () => {


    d3Store.commit("initialize", d3.select("#nodes"))
    dataStore.commit("initalize")
     var links = await d3Store.dispatch("getLinks")
     d3Store.commit("createLine", links)
     d3Store.commit("createCircles", openDrawer)
     d3Store.commit("createText")
          



      

      
      // function dragstarted(e: any, d: any) {
      //   var el = d3.select(e.sourceEvent.srcElement);
      //   state.currentNode = el;
      // }

      // function dragged(e, d) {
      //   d.x = e.x;
      //   d.y = e.y;
      //   state.currentNode!.attr("cx", e.x).attr("cy", e.y);
      //   link
      //     .attr("x1", function (d) {
      //       return d.source.x;
      //     })
      //     .attr("y1", function (d) {
      //       return d.source.y;
      //     })
      //     .attr("x2", function (d) {
      //       return d.target.x;
      //     })
      //     .attr("y2", function (d) {
      //       return d.target.y;
      //     });

      //   let parent = d3.select(state.currentNode!.node().parentNode);

      //   parent
      //     .select(`#text-${d.id}`)
      //     .attr("x", e.x)
      //     .attr("y", e.y + 75)
      // }

      // function dragended(e: any, d: any) {
      //   state.currentNode = null;
      // }

      // const zoom = d3.zoom().scaleExtent([0.5, 62]).on("zoom", zoomed)
      // let k = height / width;
      // var x = d3.scaleLinear().domain([-4.5, 4.5]).range([0, width]);
      // let y = d3
      //   .scaleLinear()
      //   .domain([-4.5 * k, 4.5 * k])
      //   .range([height, 0]);

      // function zoomed({ transform }: { transform: d3.ZoomTransform }) {
      //   const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
      //   const zy = transform.rescaleY(y).interpolate(d3.interpolateRound);
      //   circles.attr("transform", transform);
      //   texts.attr("transform", transform)
      //   link.attr("transform", transform);
      // }

      // // apply zoom
      // svg.call(zoom).call(zoom.transform, d3.zoomIdentity);
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
