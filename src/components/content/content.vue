<template>
  <!-- <v-container> -->
  <v-col id="nodes" />
  <!-- </v-container> -->
</template>

<script lang="ts">
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
    });

    const generateNodes = () => {
      let radius = 50;
      let width = window.outerWidth;
      let height = window.innerHeight - 70;

      const svg = d3
        .create("svg")
        .attr("viewBox", ["0", "0", width.toString(), height.toString()])
        .style("background-color", "lightgrey");
      d3.select("#nodes").append(() => svg.node());

      d3.range(state.nodes.length).map((i) => {
        state.nodes[i].x = Math.random() * (width - radius * 2) + radius;
        state.nodes[i].y = Math.random() * (height - radius * 2) + radius;
      });
      var color = d3.scaleOrdinal(d3.schemeCategory10);

      const node = svg
        .selectAll("g")
        .data(state.nodes)
        .enter()
        .append("g")
        .attr("x", (d, i, j) => {
          return d.x;
        })
        .attr("y", (d) => d.y)
        .attr("z-index", 0);

      const circles = node
        .append("circle")
        .attr("fill", (d, i) => color(i.toString()))
        .attr("stroke", 2)
        .attr("r", radius)
        .attr("cx", (v, i, e) => v.x)
        .attr("cy", (d) => d.y)
        .attr("z-index", 0)
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

      const texts = node
        .append("text")
        .text((d) => d.name)
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y + radius * 1.5)
        .attr("text-anchor", "middle");

      function dragstarted(e: any, d: any) {
        var el = d3.select(e.sourceEvent.srcElement);
        state.currentNode = el;
      }

      function dragged(e: any, d: any) {
        var el = e.sourceEvent.srcElement;

        state.currentNode!.attr("cx", (d.x = e.x)).attr("cy", (d.y = e.y));

        let parent = d3.select(state.currentNode!.node().parentNode);

        parent
          .select("text")
          .attr("x", (d.x = e.x))
          .attr("y", (d.y = e.y + 75));
      }

      function dragended(e: any, d: any) {
        d3.select(e.sourceEvent.srcElement)
          .classed("active", false)
          .attr("z-index", 0);
        state.currentNode = null;
      }

      const zoom = d3.zoom().scaleExtent([0.5, 62]).on("zoom", zoomed);

      let k = height / width;

      var x = d3.scaleLinear().domain([-4.5, 4.5]).range([0, width]);

      let y = d3
        .scaleLinear()
        .domain([-4.5 * k, 4.5 * k])
        .range([height, 0]);

      function zoomed({ transform }: { transform: d3.ZoomTransform }) {
        const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
        const zy = transform.rescaleY(y).interpolate(d3.interpolateRound);
        node.attr("transform", transform);
      }

      // apply zoom
      svg.call(zoom).call(zoom.transform, d3.zoomIdentity);
      console.log("generated nodes");
    };

    onMounted(() => {
      generateNodes();
    });

    return {
      ...toRefs(state),
    };
  },
});
</script>

<style scoped>
.content {
  /* height: 80vh; */
  background-color: white;
}
</style>
