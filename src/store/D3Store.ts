import NodeModel from "@/models/node";
import { reactive } from "@vue/runtime-core";
import Constants from './ConstantsStore'
import * as d3 from "d3";
import {store as datastore} from './DataStoreage'
import NodeType, { SubEnum } from "@/enums/NodeEnum";
import ServiceModel from "@/models/ServiceModel";



export const store = {
  DEBUG : true,

  state: reactive<State>({
    svg: null,
    nodes: null,
    links: null,
    texts: null,
    currentNode: null,
    onClickCallback : null,
    scale : 1,
    onNodeClickCallback : null,
    onSvgClickCallback : null
  }),

  initialize(div :  d3.Selection<d3.BaseType, unknown, HTMLElement, any>) {
    const h = screen.width/screen.height
    this.state.svg = d3
      .create("svg")
      .attr("viewBox", `0 0 ${screen.availWidth} ${screen.availHeight * 1.1}`)
      .style("background-color", "lightgrey")
      .attr("id", "svg")
      .on("click", () =>{
        if( this.state.onSvgClickCallback != null)  this.state.onSvgClickCallback()
      })


    div.append(()=> this.state.svg!.node());
  },

  setOnClickCallback(onclkcallback : any){
    this.state.onClickCallback = onclkcallback;
},
setOnNodeClickCallback(onclkcallback : any){
  this.state.onNodeClickCallback = onclkcallback;
},
setOnSvgClickCallback(onclkcallback : any){
  this.state.onSvgClickCallback = onclkcallback;
},

  createGraph(){
    
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
    .on("click", (e : Event, d) => {      
      e.stopPropagation()
      datastore.state.currentObjectNode = d;
      if(this.state.onNodeClickCallback != null) this.state.onNodeClickCallback(e,d);
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
      const arr : any[] = [];
                  
      if(v.type.value == NodeType.SERVICE.value){
        console.log("true");
        
        for (let index = 0; index < (v as ServiceModel).connections.length; index++) {
          const element =(v as ServiceModel).connections[index];
  
          arr.push({
            target: nodes.find((a) => a.id == element)!,
            source: v,
          });
        }
      }

      return arr;
    });
    const lineData = links.flat();

    console.log(lineData);
    


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
    const texts = this.state.svg!.selectAll<SVGTextElement, unknown>("text")
      .data(datastore.state.nodes as NodeModel[])

      
      texts.join(
        enter => enter
      .append("text")
      .text((d) => d.name)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y + Constants.radius * 1.5)
      .attr("id", (d) => `text-${d.id}`)
      .attr("text-anchor", "middle")
      .attr("fill", "transparent")
      .transition()
      .duration(1750)
      .attr("fill", "black"),
        update => update
        .transition()
        .duration(1750)
        .text(d => d.name)
      )

      
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


    function dragged(e: any, d: any) {
      
      //update current info model
      //times the difference between mouse events with the current scale of the zoom the add it t the current position to get the new position
      d.x +=  e.dx * 1/st.scale!
      d.y +=  e.dy * 1/st.scale!

      //update the visual node on graph
      st.currentNode!.attr("cx", d.x ).attr("cy", d.y );

      //get lines and update them from infomodel
      st.svg?.selectAll<SVGLineElement, {source : NodeModel, target:NodeModel}>("line")
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

      // get the parent of the current node wich is the svg - could also call the svg instead of parent
      const parent = d3.select(st.currentNode!.node().parentNode);

      //update the text positions with y offset
      parent
        .select(`#text-${d.id}`)
        .attr("x", d.x)
        .attr("y", d.y + 75);
    }

    function dragended(e: any, d: any) {
      st.currentNode = null;
      console.log(st.svg);
      
    }
  },

  initializeZoom() {
    
    const st = this.state

    const zoom = d3.zoom().scaleExtent([0.2, 3]).on("zoom", t =>  zoomed(t));
    
    const k = Constants.height / Constants.width;
    const x = d3.scaleLinear().domain([-4.5, 4.5]).range([0, Constants.width]);
    const y = d3
      .scaleLinear()
      .domain([-4.5 * k, 4.5 * k])
      .range([Constants.height, 0]);


    function zoomed({ transform } : {transform : d3.ZoomTransform}) {              
      const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
      const zy = transform.rescaleY(y).interpolate(d3.interpolateRound);
      st.scale = transform.k
      
      st.svg?.selectAll("circle").attr("transform", transform as any);
      st.svg?.selectAll("text").attr("transform", transform as any);
      st.svg?.selectAll("line").attr("transform", transform as any);
    }

    // apply zoom
    st.svg!
      .call((d: d3.Selection<SVGSVGElement, undefined, null, undefined>, a:any, b:any, c : any) => {

        
        zoom(d as any)
      })
      .call((d: any, t: any) => {
        // console.log(`what is t ${t}`);
        
        zoom.transform(d, t)
      }, 
      d3.zoomIdentity
        )
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
    onNodeClickCallback : any | null
    onSvgClickCallback : any | null
    scale : number
  }