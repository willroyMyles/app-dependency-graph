import NodeModel from "@/models/node";
import { reactive } from "@vue/runtime-core";
import * as d3 from "d3";


export const store ={
    state : reactive({
        nodes: [
            new NodeModel("esif"),
            new NodeModel("web admin"),
            new NodeModel("Reward service"),
          ] as Array<NodeModel>,
    }),

    nodes: [
      new NodeModel("esif"),
      new NodeModel("web admin"),
      new NodeModel("Reward service"),
    ] as Array<NodeModel>,

    initialize() {  
        const radius = 50
        const width = window.outerWidth
        const height = window.outerHeight
  
        d3.range(this.state.nodes.length).map((i) => {
          this.state.nodes[i].x = Math.random() * (width - radius * 2) + radius;
          this.state.nodes[i].y = Math.random() * (height - radius * 2) + radius;
        });
  
        this.state.nodes[1].downStream.push(this.state.nodes[2].id);
        this.state.nodes[0].downStream.push(this.state.nodes[2].id);
        this.state.nodes[1].downStream.push(this.state.nodes[0].id);

        this.nodes  = this.state.nodes as NodeModel[];
      },
}

store.initialize()