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

    state.nodes[1].downStream.push(state.nodes[2].id);
    state.nodes[0].downStream.push(state.nodes[2].id);
    state.nodes[1].downStream.push(state.nodes[0].id);

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


      // create links
      const links = state.nodes.map((v, i, nodes) => {
        var arr = [];

        for (let index = 0; index < v.downStream.length; index++) {
          const element = v.downStream[index];

          arr.push({
            target: nodes.find((a) => a.id == element)!,
            source: v,
            value: 5,
          });
        }

        return arr;
      });
      var linky = links.flat();

      var color = d3.scaleOrdinal(d3.schemeCategory10);

      // const node = svg
      //   .selectAll("g")
      //   .data(state.nodes)
      //   .enter()
      //   .append("g")
      //   .attr("z-index", 0);

      var link = svg
        .selectAll("line")
        .data(linky)
        .enter()
        .append("line")
        .style("stroke", "rgb(40,100,200)")
        .attr("stroke-opacity", 0.8)
        .attr("stroke-width", 3)
        .attr("x1", (d) => d.target.x)
        .attr("x2", (d) => d.source.x)
        .attr("y1", (d) => d.target.y)
        .attr("y2", (d) => d.source.y);

      const circles = svg
        .selectAll("circle")
        .data(state.nodes)
        .enter()
        .append("circle")
        .attr("fill", (d, i) => color(i.toString()))
        .attr("stroke", 2)
        .attr("r", radius)
        .attr("cx", (v, i, e) => v.x)
        .attr("cy", (d) => d.y)
        .attr("z-index", 0)
        .raise()
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

      const texts = svg
        .selectAll("text")
        .data(state.nodes)
        .enter()
        .append("text")
        .text((d) => d.name)
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y + radius * 1.5)
        .attr("id", (d) => `text-${d.id}`)
        .attr("text-anchor", "middle");

      function dragstarted(e: any, d: any) {
        var el = d3.select(e.sourceEvent.srcElement);
        state.currentNode = el;
      }

      function dragged(e, d) {
        d.x = e.x;
        d.y = e.y;
        state.currentNode!.attr("cx", e.x).attr("cy", e.y);
        link
          .attr("x1", function (d) {
            return d.source.x;
          })
          .attr("y1", function (d) {
            return d.source.y;
          })
          .attr("x2", function (d) {
            return d.target.x;
          })
          .attr("y2", function (d) {
            return d.target.y;
          });

        let parent = d3.select(state.currentNode!.node().parentNode);

        parent
          .select(`#text-${d.id}`)
          .attr("x", e.x)
          .attr("y", e.y + 75)
          // .attr("transform", "translate(" + [0, 75] + ")");
      }

      function dragended(e: any, d: any) {
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
        circles.attr("transform", transform);
        texts.attr("transform", transform)
        link.attr("transform", transform);
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
.link {
  fill: none;
}
</style>
