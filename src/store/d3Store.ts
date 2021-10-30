import { createStore, Store, useStore } from "vuex";
import * as d3 from "d3";
import { InjectionKey } from "vue";
import dataStore, { useDataStore } from "./dataStore";
import NodeModel from "@/models/node";

interface State {
  svg: d3.Selection<SVGSVGElement, undefined, null, undefined> | null;
  nodes: d3.Selection<SVGCircleElement, NodeModel, SVGSVGElement, undefined> | null;
  links: d3.Selection<SVGLineElement, unknown, SVGSVGElement, undefined> | null;
  texts: d3.Selection<SVGTextElement, NodeModel, SVGSVGElement, undefined> | null;
  currentNode: d3.Selection<any, unknown, null, undefined> | null;
  radius: number;
  width: number;
  height: number;
}

export const key: InjectionKey<Store<State>> = Symbol();
export function useThisStore() {
  return useStore(key);
}

export default createStore<State>({
  state: {
    svg: null,
    nodes: null,
    links: null,
    texts: null,
    radius: 50,
    width: window.outerWidth,
    height: window.outerHeight,
    currentNode: null,
  },
  mutations: {
    initialize(ctx, div) {
      ctx.svg = d3
        .create("svg")
        .attr("viewBox", `0 0 ${ctx.width} ${ctx.height}`)
        .style("background-color", "lightgrey")
        .attr("id", "svg");
      // .on("dblclick",(e, i) => handleDoubleClick(e, i))

      div.append(() => ctx.svg!.node());
    },

    // generateLinks(ctx) {
    //   const datastore = useDataStore();

    //   // create links
    //   const links = datastore.state.nodes.map((v, i, nodes) => {
    //     const arr = [];

    //     for (let index = 0; index < v.downStream.length; index++) {
    //       const element = v.downStream[index];

    //       arr.push({
    //         target: nodes.find((a) => a.id == element)!,
    //         source: v,
    //         value: 5,
    //       });
    //     }

    //     return arr;
    //   });
    //  return links.flat();
    // },

    generateSingleLink(ctx, model: NodeModel) {
      console.log("generated");
      
    },

    createCircles(ctx, onClickCallback) {
      const {nodes, svg, radius} = ctx;
      const color = d3.scaleOrdinal(d3.schemeCategory10);
      
      ctx.nodes = ctx.svg!
        .selectAll("circle")
        .data(dataStore.state.nodes)
        .enter()
        .append("circle")
        .attr("fill", (d, i) => color(i.toString()))
        .attr("stroke", 2)
        .attr("r", radius)
        .attr("cx", (v, i, e) => v.x)
        .attr("cy", (d) => d.y)
        .attr("z-index", 0)
        .on("click", (e, i) => onClickCallback())
        // .call(
        //   d3
        //     .drag()
        //     .on("start", dragstarted)
        //     .on("drag", dragged)
        //     .on("end", dragended)
        // );
    },
    createLine(ctx, lineData : any[]) {
      console.log(lineData);
      
      ctx.links = ctx.svg!
      .selectAll("line")
      .data(lineData)
      .enter()
      .append("line")
      .style("stroke", "rgb(40,100,200)")
      .attr("stroke-opacity", 0.8)
      .attr("stroke-width", 3)
      .attr("x1", (d) => d.target.x)
      .attr("x2", (d) => d.source.x)
      .attr("y1", (d) => d.target.y)
      .attr("y2", (d) => d.source.y);
    },

    createText(ctx){

       ctx.texts = ctx.svg!
        .selectAll("text")
        .data(dataStore.state.nodes)
        .enter()
        .append("text")
        .text((d) => d.name)
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y + ctx.radius * 1.5)
        .attr("id", (d) => `text-${d.id}`)
        .attr("text-anchor", "middle");

    }
  },
  actions: {
    getLinks() {
      const datastore = useDataStore();
      const { nodes } = datastore.state;

      const links = nodes.map((v, i, nodes) => {
        const arr = [];

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
      console.log(links);
      
      return links.flat();
    },
  },
  modules: {},
});
