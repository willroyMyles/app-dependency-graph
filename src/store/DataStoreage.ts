import NodeType, { SubEnum } from "@/enums/NodeEnum";
import DatabaseModel from "@/models/databaseModel";
import NodeModel from "@/models/node";
import ServiceModel from "@/models/ServiceModel";
import { reactive } from "@vue/runtime-core";
import * as d3 from "d3";
import {store as d3store} from './D3Store'
import { nodeService } from '../services/NodeService';

export const store ={
    state : reactive({
        nodes: new Map<string, NodeModel>(),
          currentObjectNode : null as NodeModel | null
    }),

    initialize() {  
      console.log(`hmmmmm ${process.env.VUE_APP_SERVER_PORT}`);
        const radius = 50
        const width = window.outerWidth
        const height = window.outerHeight

        const esif = new ServiceModel("esif")
        const wa = new ServiceModel("web admin")
        const rs = new ServiceModel("Reward service")
        
        // this.state.nodes.set(esif.id, esif)
        // this.state.nodes.set(wa.id, wa)
        // this.state.nodes.set(rs.id, rs)
        this.getNodes();
        console.log(this.state.nodes);
 

        this.state.nodes.forEach((v)=>{
          v.x = Math.random() * (width - radius * 2) + radius;
          v.y = Math.random() * (height - radius * 2) + radius;

          (v as ServiceModel).connections.forEach(connection => {
            this.createConnection(v.id, connection)
          });
        })

        // this.createConnection(wa.id, rs.id);
        // this.createConnection(esif.id, rs.id);
        // this.createConnection(wa.id, esif.id);
  
        // (this.state.nodes[1] as ServiceModel).connections.push(this.state.nodes[2].id);
        // (this.state.nodes[0] as ServiceModel).connections.push(this.state.nodes[2].id);
        // (this.state.nodes[1] as ServiceModel).connections.push(this.state.nodes[0].id);
        setTimeout(() => {
          d3store.createGraph()
        },1000);
      },

    addNode(node : NodeModel){
      console.log("addNode");
      nodeService.addNode(node);
      this.state.nodes.set(node.id, node)
    },

    createConnection(sourceId : string, targetId : string){
      const source = (this.state.nodes.get(sourceId) as ServiceModel)
      source.connections.push(targetId)
    },

    getNode(id : string) : NodeModel | undefined{
      return this.state.nodes.get(id) as NodeModel
    },

    getNamebuId(id : string) : string | undefined{
      return this.getNode(id)?.name
    },

    getNodes(){
      console.log("getNodes");
      return nodeService.getNodes().then(response => {
        response.data.forEach(node => {
          this.state.nodes.set(node.id, node);
        })
      });
    },

    getLinks() : Array<Links>{
      const link : Links[][] = [];
      this.state.nodes.forEach((node, key) => {
        if(node.type.isService()){
          console.log(node);
          
          const linksInArray =  (node as ServiceModel).connections.map((connection, index) => <Links>{
            source : node,
            target: this.getNode(connection)
          })
          link.push(linksInArray)
        }
      })
    
      return link.flat();
    },

    updateNode(node : NodeModel) : NodeModel{
      const original = this.state.nodes.get(node.id)
      // if types are the same update else create new node with base props


        let n : NodeModel | null= null;
        if(node.type.isDatabase()) n = new DatabaseModel(node.name, node)
        if(node.type.isService()) n = new ServiceModel(node.name, node)
        
        nodeService.updateNode(node);
        this.addNode(n!)
        d3store.createGraph();
        return n!;
      // should update graph
    },

    // changeType(node : NodeModel){
    //   return node as DatabaseModel
    // }
}

export interface Links{
  source : NodeModel,
  target : NodeModel
}

store.initialize()