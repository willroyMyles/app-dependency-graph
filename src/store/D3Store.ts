import NodeModel from "@/models/node";
import { reactive } from "@vue/runtime-core";
import Constants from './ConstantsStore'
import * as d3 from "d3";
import {store as datastore} from './DataStoreage'



export const store = {
  DEBUG : true,

  state: reactive<State>({
    svg: null,
    nodes: null,
    links: null,
    texts: null,
    currentNode: null,
    onClickCallback : null,
    zx : 1,
    zy : 1
  }),

  initialize(div :  d3.Selection<d3.BaseType, unknown, HTMLElement, any>) {
    this.state.svg = d3
      .create("svg")
      .attr("viewBox", `0 0 ${Constants.width} ${Constants.height}`)
      .style("background-color", "lightgrey")
      .attr("id", "svg");
    div.append(()=> this.state.svg!.node());
  },

  setOnClickCallback(onclkcallback : any){
      this.state.onClickCallback = onclkcallback;
  },

  createGraph(){
      console.log(this.state);      
      this.createCircles()
    this.createLine()
    this.createText()
    this.initializeDrag()
    this.initializeZoom()

    this.state.svg?.selectAll("circle").exit().remove()
  },

  createCircles() {
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const nodes = this.state.svg?.selectAll<SVGCircleElement, unknown>("circle").data(datastore.state.nodes);

    nodes?.join(
        enter => enter
        .append("circle")
    .attr("cx", d=> d.x)
    .attr("cy", d => d.y)
    .attr("fill", d => color(d.name))
    .on("click", (e, d) => {      
      datastore.state.currentObjectNode = d;
      this.state.onClickCallback(d);
    })
    .transition()
    .duration(750)
    .attr("opacity", 1)
    .attr("r", Constants.radius),
    update=> update
    .transition()
    .duration(750)
    )


  },
  createLine() {
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
    const lineData = links.flat();


    const lines = this.state.svg?.selectAll<SVGLineElement, unknown>("line").data(lineData)

    lines?.join(
        enter => enter
    .append("line")
      .style("stroke", "rgb(40,100,200)")
      .attr("stroke-opacity", 0.8)
      .attr("x2", (d) => d.source.x)
      .attr("y2", (d) => d.source.y)
      .attr("x1", (d) => d.target.x)
      .attr("opacity", .2)
      .attr("y1", (d) => d.target.y)
      .transition().duration(1750)
      .attr("stroke-width", 3),
      update => update
      .transition()
      .duration(700)
      .attr("stroke-width", 3)
      .style("stroke", "rgb(140,100,200)")

    )



  },

  createText() {
    this.state.texts =       this.state.svg!.selectAll("text")
      .data(datastore.state.nodes as NodeModel[])
      
    //   .text(d => d.name +"updated")
      .enter()
      .append("text")
      .text((d) => d.name)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y + Constants.radius * 1.5)
      .attr("id", (d) => `text-${d.id}`)
      .attr("text-anchor", "middle");
  },

  initializeDrag() {
    const st = this.state

    this.state.svg?.selectAll<SVGCircleElement, NodeModel>("circle")
    .call(
        d3.drag<SVGCircleElement, NodeModel>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    )

    function dragstarted(e: any, d: any) {
      const el = d3.select(e.sourceEvent.srcElement);
      st.currentNode = el;
    }

    function dragged(e: DragEvent, d: any) {
      d.x = e.x;
      d.y = e.y;
      st.currentNode!.attr("cx", e.x * st.zx).attr("cy", e.y * st.zy);
      st.svg?.selectAll<SVGLineElement, {source : NodeModel, target:NodeModel}>("line").attr("x1", function (d) {
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

      const parent = d3.select(st.currentNode!.node().parentNode);

      parent
        .select(`#text-${d.id}`)
        .attr("x", e.x)
        .attr("y", e.y + 75);
    }

    function dragended(e: any, d: any) {
      st.currentNode = null;
    }
  },

  initializeZoom() {
    
    const st = this.state

    const zoom = d3.zoom().scaleExtent([0.5, 62]).on("zoom", zoomed);
    const k = Constants.height / Constants.width;
    const x = d3.scaleLinear().domain([-4.5, 4.5]).range([0, Constants.width]);
    const y = d3
      .scaleLinear()
      .domain([-4.5 * k, 4.5 * k])
      .range([Constants.height, 0]);

    function zoomed({ transform }: { transform: any }) {        
      const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
      const zy = transform.rescaleY(y).interpolate(d3.interpolateRound);
      st.svg?.selectAll("circle").attr("transform", transform);
      st.svg?.selectAll("text").attr("transform", transform);
      st.svg?.selectAll("line").attr("transform", transform);
    }

    // apply zoom
    st.svg!
      .call((d: any) => zoom(d))
      .call((d: any, t: any) => zoom.transform(d, t), d3.zoomIdentity)
      .on("dblclick.zoom", null)
  },

  onDoubleClick( callback : any) {
    console.log("hdclick");
    this.state.svg!.on("dblclick", handleDoubleClick);
    const st = this.state

    function handleDoubleClick(e: any, i: any) {

        console.log("yo");
        
      //create new node
      const node = new NodeModel();
      node.x = e.x;
      node.y = e.y;

      //add node to list
      datastore.state.nodes.push(node);

          
            createGraphInternal();
    


    }
  },


};


function createGraphInternal(){
    store.createGraph()
}



interface State {
    svg: d3.Selection<SVGSVGElement, undefined, null, undefined> | null;
    nodes: d3.Selection<
      SVGCircleElement,
      NodeModel,
      SVGSVGElement,
      undefined
    > | null;
    links: d3.Selection<SVGLineElement, any, SVGSVGElement, undefined> | null;
    texts: d3.Selection<
      SVGTextElement,
      NodeModel,
      SVGSVGElement,
      undefined
    > | null;
    currentNode: d3.Selection<any, unknown, null, undefined> | null;
    onClickCallback : any | null
    zx : any
    zy : any
  }