import NodeModel from "@/models/node";
import { reactive } from "@vue/runtime-core";
import Constants from "./ConstantsStore";
import * as d3 from "d3";
import { store as datastore } from "./DataStoreage";
import NodeType, { SubEnum } from "@/enums/NodeEnum";
import ServiceModel from "@/models/ServiceModel";

export const store = {
  DEBUG: true,

  state: reactive<State>({
    svg: null,
    nodes: null,
    links: null,
    texts: null,
    currentNode: null,
    onClickCallback: null,
    scale: 1,
    onNodeClickCallback: null,
    onSvgClickCallback: null,
    transform: new d3.ZoomTransform(1, 0, 0),
  }),

  initialize(div: d3.Selection<d3.BaseType, unknown, HTMLElement, any>) {
    this.state.svg = d3
      .create("svg")
      .attr("viewBox", `0 0 ${Constants.content_width * .8} ${Constants.height}`)
      .style("background-color", "lightgrey")
      .attr("id", "svg")
      .on("click", () => {
        if (this.state.onSvgClickCallback != null)
          this.state.onSvgClickCallback();
      });

    div
      .append(() => this.state.svg!.node())
      .attr("width", Constants.content_width * .8)
      .attr("height", Constants.height);
  },

  setOnClickCallback(onclkcallback: any) {
    this.state.onClickCallback = onclkcallback;
  },
  setOnNodeClickCallback(onclkcallback: any) {
    this.state.onNodeClickCallback = onclkcallback;
  },
  setOnSvgClickCallback(onclkcallback: any) {
    this.state.onSvgClickCallback = onclkcallback;
  },

  createGraph() {
    this.createLine();
    this.createCircles();
    this.createText();
    this.initializeDrag();
    this.initializeZoom()

    this.state.svg?.selectAll("circle").raise();
  },

  createCircles() {
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const nodes = this.state.svg
      ?.selectAll<SVGCircleElement, unknown>("circle")
      .data(datastore.state.nodes);

    nodes?.join(
      (enter) =>
        enter
          .append("circle")
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y)
          .attr("fill", (d) => color(d.name))
          .on("click", (e: Event, d) => {
            e.stopPropagation();
            datastore.state.currentObjectNode = d;
            if (this.state.onNodeClickCallback != null)
              this.state.onNodeClickCallback(e, d);
          })
          .transition()
          .duration(750)
          // .attr("transform", this.state.transform as any)
          .attr("opacity", 1)
          .attr("r", Constants.radius),
      (update) => update.transition().duration(750)
    );
  },
  createLine() {
    const { nodes } = datastore.state;

    const links = nodes.map((v, i, nodes) => {
      const arr: any[] = [];

      if (v.type.value == NodeType.SERVICE.value) {
        console.log("true");

        for (
          let index = 0;
          index < (v as ServiceModel).connections.length;
          index++
        ) {
          const element = (v as ServiceModel).connections[index];

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

    const lines = this.state.svg
      ?.selectAll<SVGLineElement, unknown>("line")
      .data(lineData);

    lines?.join(
      (enter) =>
        enter
          .append("line")
          .style("stroke", "rgb(40,100,200)")
          .attr("stroke-opacity", 0.8)
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("opacity", 0.2)
          .attr("x2", (d) => d.source.x)
          .attr("y2", (d) => d.source.y)
          .transition()
          .duration(1750)
          .attr("stroke-width", 3)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y),
      (update) =>
        update
          .transition()
          .duration(700)
          .attr("stroke-width", 3)
          .style("stroke", "rgb(140,100,200)")
    );
  },

  createText() {
    const texts = this.state
      .svg!.selectAll<SVGTextElement, unknown>("text")
      .data(datastore.state.nodes as NodeModel[]);

    texts.join(
      (enter) =>
        enter
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
      (update) =>
        update
          .transition()
          .duration(1750)
          .text((d) => d.name)
    );
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
      d.x += (e.dx * 1) / st.scale!;
      d.y += (e.dy * 1) / st.scale!;

      //update the visual node on graph
      st.currentNode!.attr("cx", d.x).attr("cy", d.y);

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
    }
  },

  initializeZoom() {
    const st = this.state;

    const zoom = d3
      .zoom()
      .scaleExtent([0.2, 3])
      .on("zoom", (t) => zoomed(t));

    const k = Constants.height / Constants.content_width;
    const x = d3.scaleLinear().domain([-4.5, 4.5]).range([0, Constants.width]);
    const y = d3
      .scaleLinear()
      .domain([-4.5 * k, 4.5 * k])
      .range([Constants.height, 0]);

    function zoomed({ transform }: { transform: d3.ZoomTransform }) {
      console.log("called");

      const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
      const zy = transform.rescaleY(y).interpolate(d3.interpolateRound);
      st.scale = transform.k;
      st.transform = transform;

      st.svg?.selectAll("circle").attr("transform", transform as any);
      st.svg?.selectAll("text").attr("transform", transform as any);
      st.svg?.selectAll("line").attr("transform", transform as any);
    }

    // apply zoom
    st.svg!.call(
      (
        d: d3.Selection<SVGSVGElement, undefined, null, undefined>,
      ) => {
        zoom(d as any);
      }
    )
      .call((d: any, t: any) => {
        zoom.transform(d, st.transform);
      }, d3.zoomIdentity)
      .on("dblclick.zoom", null);
  },

  onDoubleClick(callback: any) {
    console.log("hdclick");
    this.state.svg!.on("dblclick", handleDoubleClick);
    const st = this.state;

    function handleDoubleClick(e: any, i: any) {
      const t = st.transform.invert([e.x, e.y])

      //create new node
      const node = new ServiceModel();
      node.x = t[0];
      node.y = t[1];

      //add node to list
      datastore.state.nodes.push(node);

      createGraphInternal();
    }
  },
};

function createGraphInternal() {
  store.createGraph();
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
  onClickCallback: any | null;
  onNodeClickCallback: any | null;
  onSvgClickCallback: any | null;
  scale: number;
  transform: d3.ZoomTransform;
}
