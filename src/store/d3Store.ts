import { createStore, Store, useStore } from "vuex";
import * as d3 from "d3";
import { InjectionKey } from "vue";
import dataStore, { useDataStore } from "./dataStore";
import NodeModel from "@/models/node";

interface State {
  svg: d3.Selection<SVGSVGElement, undefined, null, undefined> | null;
  nodes: d3.Selection<SVGCircleElement, NodeModel, SVGSVGElement, undefined> | null;
  links: d3.Selection<SVGLineElement, any, SVGSVGElement, undefined> | null;
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
    },
    createLine(ctx, lineData : any[]) {
      
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

    },

    initializeDrag(ctx){

      ctx.nodes!.call(
        d3.drag<SVGCircleElement, NodeModel, NodeModel>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      );

      function dragstarted(e: any, d: any) {
        const el = d3.select(e.sourceEvent.srcElement);
        ctx.currentNode = el;
      }

      function dragged(e : DragEvent, d : any) {
        d.x = e.x;
        d.y = e.y;
        ctx.currentNode!.attr("cx", e.x).attr("cy", e.y);
        ctx.links!
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

        const parent = d3.select(ctx.currentNode!.node().parentNode);

        parent
          .select(`#text-${d.id}`)
          .attr("x", e.x)
          .attr("y", e.y + 75)
      }

      function dragended(e: any, d: any) {
        ctx.currentNode = null;
      }
    },

    initializeZoom(ctx){

      const {height, width, nodes, links, texts, svg} = ctx
      
      const zoom = d3.zoom().scaleExtent([0.5, 62]).on("zoom", zoomed)
      const k = height / width;
      const x = d3.scaleLinear().domain([-4.5, 4.5]).range([0, width]);
      const y = d3
        .scaleLinear()
        .domain([-4.5 * k, 4.5 * k])
        .range([height, 0]);

      function zoomed({ transform } : {transform : any}) {
        const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
        const zy = transform.rescaleY(y).interpolate(d3.interpolateRound);
        nodes!.attr("transform", transform);
        texts!.attr("transform", transform)
        links!.attr("transform", transform);
      }

      // apply zoom
      svg!.call( (d : any) => zoom(d)).call((d:any, t : any) => zoom.transform(d, t), d3.zoomIdentity);
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
          });
        }

        return arr;
      });      
      return links.flat();
    },
  },
  modules: {},
});
