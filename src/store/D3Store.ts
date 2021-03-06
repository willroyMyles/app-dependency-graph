import NodeModel from "@/models/node";
import { reactive } from "@vue/runtime-core";
import C from "./ConstantsStore";
import * as d3 from "d3";
import { store as datastore } from "./DataStoreage";
import NodeType, { SubEnum } from "@/enums/NodeEnum";
import ServiceModel from "@/models/ServiceModel";

export const store = {
  DEBUG: true,


  state: reactive({
    svg: null as d3.Selection<SVGSVGElement, undefined, null, undefined> | null,
    currentNode: null as d3.Selection<any, unknown, null, undefined> | null,
    selected : null as NodeModel | null,
    onNodeClickCallback: null as any,
    onSvgClickCallback: null as any,
    onRightClickCallback: null as any,
    transform: new d3.ZoomTransform(1, 0, 0),
    nodeToHighlight : null as string | null
  }),

  unselectCircle(){
    if(this.state.selected != null){
          
      d3.select(`#circle-${this.state.selected.id}`).transition().duration(500)
      .attr("stroke-width", 0)     
      .attr("stroke", "transparent")      
      .attr("opacity", 1)
      .attr("r", C.radius)
      this.state.selected = null
    }
  },

  selectCircle(d : NodeModel){
      if(this.state.selected != null) this.unselectCircle()
      d3.select(`#circle-${d.id}`).transition().duration(500)
      .attr("stroke-width", 5) 
      .attr("stroke", "rgba(10, 200,50,0.2)")
      .attr("opacity", 1)
      .attr("r", C.radius)
      this.state.selected = d
  },

  initialize(div: d3.Selection<d3.BaseType, unknown, HTMLElement, any>) {
    this.state.svg = d3
      .create("svg")
      // .attr(
      //   "viewBox",
      //   `0 0 ${C.content_width * 0.8} ${C.height}`
      // )
      .style("background-color", "rgba(240,240,240,1.0)")
      .attr("id", "svg")
      .on("click", () => {
        // when you click away close context menu
        d3.select('#myContextMenu')
        .style('display', 'none')

        if (this.state.onSvgClickCallback != null)
          this.state.onSvgClickCallback();
        this.unselectCircle()
      })
      .on("contextmenu", function(data, index){
        const position = d3.pointer(data);
        d3.select('#myContextMenu')
        .style('left', position[0] + "px")
        .style('top', position[1]+ "px")
        .style('display', 'block')

        data.preventDefault();
      });

      d3.selectAll('.context-item')
      .on('click', (e:Event, d) => {
        d3.select('#myContextMenu')
        .style('display', 'none')
        console.log("top event coords: ",d3.pointer(e))
        const operation = (<HTMLLIElement>e.target).getAttribute("data")
        this.resolveContextMenuItemClick(e, operation);
      })

      this.onDoubleClick(null)
      const zoomDisplay = d3.create("svg").append("svg")
      .attr("height", 40)
      .attr("width", 150)
      // .style("background-color", "blue")
      .attr("opacity", 1)
      .attr("id","zoom-svg")


    div
      .append(() => this.state.svg!.node())
      .attr("width", C.content_width * 0.8)
      .attr("height", C.height);

    const div2 = d3.select("#zoom").style("position", "absolute")

    div2.append(() => zoomDisplay.node())

    this.initializeZoomRect()

  },
  initializeZoomRect(){

    const zoomDisplay = d3.select("#zoom-svg")

    zoomDisplay
    .append("rect")
    .attr("y",0)
    .attr("x", 0)
    .attr("fill", "rgba(50,50,50,0.2)")
    .attr("width", 150)
    .attr("height", 40)
    .attr("opacity", 0.2)

    zoomDisplay
    .append("rect")
    .attr("y",5)
    .attr("x", 100)
    .attr("ry",100)
    .attr("rx", 100)
    .attr("fill", "rgba(250,50,50,0.2)")
    .attr("width", 30)
    .attr("height", 30)
    .attr("opacity", 0.9)
    .on("click" ,(e : Event) => {
      e.stopPropagation()
      this.resetZoom();
    })

      zoomDisplay
      .append("text")
      .text("hello world")
      .attr("y", 25)
      .attr("x",10)
      .attr("fill", "green")
      .attr("text-anchor", "start")
      .attr("stroke-opacity", 1)
  },

  setOnNodeClickCallback(onclkcallback: any) {
    this.state.onNodeClickCallback = onclkcallback;
  },
  setOnSvgClickCallback(onclkcallback: any) {
    this.state.onSvgClickCallback = onclkcallback;
  },

  setOnRightClickCallback(onRightClickCallback: any){
    this.state.onRightClickCallback = onRightClickCallback;
  },

  resetZoom(){

    const zoomf = d3.zoom()
    const {k, x, y} = this.state.transform
    
    this.state.transform = d3.zoomIdentity

    this.state.svg?.call(zoomf.transform as any, this.state.transform )

    this.state.svg?.selectAll("circle").transition().duration(500).attr("transform", this.state.transform  as any);
    this.state.svg?.selectAll("text").transition().duration(500).attr("transform", this.state.transform  as any);
    this.state.svg?.selectAll("line").transition().duration(500).attr("transform", this.state.transform  as any);
  this.state.svg?.selectAll("image").transition().duration(500).attr("transform", this.state.transform.translate(-C.radius/2, -C.radius/2) as any);

    d3.select("#zoom-svg").select("text").transition().duration(2500)
    .text(`zoom : 1.00`)
    
 
  },

  createGraph() {    
    this.createCircles();
    this.createImages();
    this.createText();
    this.initializeDrag();
    this.initializeZoom();
    this.createLine();

    this.state.svg?.selectAll("circle").raise();
    this.highlightNode(null)

  },

  async createImages(){
    const nodes = this.state.svg
    ?.selectAll<any, NodeModel>("image")
    .data<NodeModel>(datastore.getNodes(), d => `img-${d.id}`)


    // #### images have to be in public folder in path
    //create images 
    nodes?.join(
      enter => enter 
      .append("image")
      .attr("href", (d) =>{
        let imgPath = "./assets/svg/app.svg"
        if(d.type.isService()) imgPath = "./assets/svg/app.svg"
        if(d.type.isDatabase()) imgPath = "./assets/svg/db.svg"        
        return imgPath
      })
      .attr("id", d => `image-${d.id}`)
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("transform", `translate(${-C.radius/2}, ${-C.radius/2})`)
      .attr("width", C.radius)
      .attr("height", C.radius)
          .on("click", (e: Event, d) => null)
          .transition()
          .duration(750)
          // .attr("transform", this.state.transform as any)
          .attr("opacity", 1)
          .attr("r", C.radius)
          
          ,
      (update) => update
      . transition().duration(750)

    //  . attr("opacity", 0.0)
     . transition().duration(750)
      .attr("href", (d) =>{
        let imgPath = "./assets/svg/app.svg"
        if(d.type.isService()) imgPath = "./assets/svg/app.svg"
        if(d.type.isDatabase()) imgPath = "./assets/svg/db.svg"        
        return imgPath
      })
     . attr("opacity", 1.0)

    )
  },

  highlightNode( d : any){

    if(this.state.nodeToHighlight){
      const nodeToHighlight = this.state.svg?.select(`#${this.state.nodeToHighlight}`)
      const data = nodeToHighlight?.data()[0];      
      this.state.onNodeClickCallback(null, data)
      this.selectCircle(data as any)
      this.state.nodeToHighlight = null
    }

    return d;
  },

  createCircles() {
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const nodes = this.state.svg
      ?.selectAll<any, NodeModel>("circle")
      .data<NodeModel>(datastore.getNodes(), d => `circle-${d.id}`)

      
    //create circles
    nodes?.join(
      enter => enter 
      .append("circle")
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y)
          .attr("fill", (d) => "rgba(0,0,0,.02)")
          .attr("id",  d => `circle-${d.id}`)
          .attr("stroke", "rgba(10, 200,50,0.2)")
          .attr("stroke-width", 0)
          .attr("r", C.radius * 3)

          .on("click", (e: Event, d) => {
            e.stopPropagation();
            datastore.state.currentObjectNode = d;
            
            if (this.state.onNodeClickCallback != null)
              this.state.onNodeClickCallback(e, d);

            //add stroke to seected node
            this.selectCircle(d)       
          })
          .transition()
          .duration(750)
          .attr("opacity", 1)
          .attr("r", C.radius)
          // .call(d => this.highlightNode(d as any))
          
          ,
      (update) => update.transition().duration(750)
    )

  },
  createLine() {
    const lineData = datastore.getLinks();
    const lines = this.state.svg
      ?.selectAll<SVGLineElement, { source: NodeModel; target: NodeModel }>(
        "line"
      )
      .data(lineData, (d) => d.source.id + d.target.id);

    const markers = this.state.svg?.append("defs").append("marker");
    const markerSize = 14;
    const color = "rgba(40,100,200, .8)"
    markers
      ?.attr("viewBox", "0 -5 10 10")
      .attr("id", "arrow")
      .attr("refX", C.radius - markerSize)
      .attr("refY", 0)
      .attr("markerWidth", markerSize / 3)
      .attr("markerHeight", markerSize / 3)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("class", "arrowHead")
      .attr("fill", color)
      .attr("opacity", .9)
      .attr("stroke-width", 2);

    lines?.join(
      (enter) =>
        enter
          .append("line")
          .style("stroke", "transparent")
          .attr("stroke-opacity", 1)
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("opacity", 0.9)
          .attr("x2", (d) => d.source.x)
          .attr("y2", (d) => d.source.y)
          .attr("marker-end", "url(#arrow)")
          .transition()
          .duration(1500)
          .attr("stroke-width", 3)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y)
          .transition()
          .duration(500)
          .style("stroke", color)
          ,
      (update) =>
        update
          .transition("exit line")
          .duration(700)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y)
          .attr("stroke-width", 3)
          ,
      (exit) =>
        exit
          .transition()
          .duration(1700)
          .attr("stroke-opacity", 0)
          .attr("stroke-width", 0)
          .attr("x2", (d) => d.source.x)
          .attr("y2", (d) => d.source.y)
          .remove()
    ).lower()
    

  },

  createText() {
    const texts = this.state
      .svg!.selectAll<SVGTextElement, NodeModel>("text")
      .data(datastore.getNodes(), d => `text-${d.id}`);

    texts.join(
      (enter) =>
        enter
          .append("text")
          .text((d) => d.name)
          .attr("x", (d) => d.x)
          .attr("y", (d) => C.textOffset(d.y))
          .attr("id", (d) => `text-${d.id}`)
          .attr("text-anchor", "middle")
          .attr("fill", "transparent")
          .attr("padding", "10")
          .attr("background-color", "lightgrey")
          .transition()
          .duration(1750)
          .attr("fill", "black"),
      (update) =>
        update
          .transition()
          .duration(1750)
          .text((d) => d.name)
    )
    
  },

  initializeDrag() {
    const st = this.state;

    this.state.svg
      ?.selectAll<SVGCircleElement, NodeModel>("circle")
      .call(
        d3
          .drag<SVGCircleElement, NodeModel>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    function dragstarted(e: any, d: any) {
      const el = d3.select(e.sourceEvent.srcElement);
      st.currentNode = el;
    }

    function dragged(e: any, d: any) {

      //update current info model
      //times the difference between mouse events with the current scale of the zoom the add it t the current position to get the new position
      d.x += (e.dx * 1) / st.transform.k;
      d.y += (e.dy * 1) / st.transform.k;      

      //update the visual node on graph
      st.currentNode!.attr("cx", d.x).attr("cy", d.y);

      //update image position 
      st.svg?.select(`#image-${d.id}`).attr("x", d.x ).attr("y", d.y)

      //get lines and update them from infomodel
      st.svg
        ?.selectAll<SVGLineElement, { source: NodeModel; target: NodeModel }>(
          "line"
        )
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

      //update the text positions with y offset
        st.svg!
        .select<any>(`#text-${d.id}`)
        .attr("x", d.x)
        .attr("y", (d : any) => C.textOffset(d.y));
    }

    function dragended(e: any, d: any) {
      st.currentNode = null;
    }
  },

  initializeZoom() {
    const st = this.state;

    const zoom = d3
      .zoom()
      .scaleExtent([0.2, 3])
      .on("zoom", (t) => zoomed(t));

    const k = C.height / C.content_width;
    const x = d3.scaleLinear().domain([-4.5, 4.5]).range([0, C.width]);
    const y = d3
      .scaleLinear()
      .domain([-4.5 * k, 4.5 * k])
      .range([C.height, 0]);

    function zoomed({ transform }: { transform: d3.ZoomTransform }) {
      const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
      const zy = transform.rescaleY(y).interpolate(d3.interpolateRound);
      st.transform = transform;

      d3.select("#zoom-svg").select("text").text(`zoom : ${st.transform.k.toFixed(2)}`)


      st.svg?.selectAll("circle").attr("transform", transform as any);
      st.svg?.selectAll("text").attr("transform", transform as any);
      st.svg?.selectAll("line").attr("transform", transform as any);
      st.svg?.selectAll("image").attr("transform", transform.translate(-C.radius/2, -C.radius/2) as any);
    }

    // apply zoom
    st.svg!.call(
      (d: d3.Selection<SVGSVGElement, undefined, null, undefined>) => {
        zoom(d as any);
      }
    )
      .call((d: any, t: any) => {
        zoom.transform(d, st.transform);
      }, d3.zoomIdentity)
      .on("dblclick.zoom", null);
  },

  onDoubleClick(callback: any) {
    this.state.svg!.on("dblclick", this.handleDoubleClick);
    const st = this.state;

  },
  resolveContextMenuItemClick(e:Event, d:any){
    switch(d){
      case "createNode":{
        this.handleDoubleClick(e, null);
        break;
      }
      default: {
        console.log("No Operation defined")
        break;
      }
    }

  },
  
   handleDoubleClick(e: any, i: any) {
    const t = this.state.transform.invert([e.x, e.y]);

    //create new node
    const node = new ServiceModel();
    node.x = t[0];
    node.y = t[1];
    this.state.nodeToHighlight = `circle-${node.id}`

    //add node to list
    datastore.addNode(node);

    createGraphInternal();
    //highlight just created node
  }
};

function createGraphInternal() {
  store.createGraph();
}
