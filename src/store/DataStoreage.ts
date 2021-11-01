import NodeModel from "@/models/node";
import ServiceModel from "@/models/ServiceModel";
import { reactive } from "@vue/runtime-core";
import * as d3 from "d3";
import {store as d3store} from './D3Store'


export const store ={
    state : reactive({
        nodes: [
            new ServiceModel("esif"),
            new ServiceModel("web admin"),
            new ServiceModel("Reward service"),
          ] as Array<NodeModel>,
          currentObjectNode : null as NodeModel | null
    }),

    initialize() {  
        const radius = 50
        const width = window.outerWidth
        const height = window.outerHeight
  
        d3.range(this.state.nodes.length).map((i) => {
          this.state.nodes[i].x = Math.random() * (width - radius * 2) + radius;
          this.state.nodes[i].y = Math.random() * (height - radius * 2) + radius;
        });
  
        (this.state.nodes[1] as ServiceModel).connections.push(this.state.nodes[2].id);
        (this.state.nodes[0] as ServiceModel).connections.push(this.state.nodes[2].id);
        (this.state.nodes[1] as ServiceModel).connections.push(this.state.nodes[0].id);
      },

    getNode(id : string) : NodeModel | undefined{
      return this.state.nodes.find( p => p.id == id) as NodeModel
    },

    getNamebuId(id : string) : string | undefined{
      return this.getNode(id)?.name
    },

    updateNode(node : NodeModel){
      const index = this.state.nodes.indexOf(this.getNode(node.id)!)
      this.state.nodes[index] = node;
      console.log(this.state.nodes[index]);
      d3store.createGraph();

      
      // should update graph
    }
}

store.initialize()