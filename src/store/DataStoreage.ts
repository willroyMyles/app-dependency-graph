import NodeType, { SubEnum } from "@/enums/NodeEnum";
import DatabaseModel from "@/models/databaseModel";
import NodeModel from "@/models/node";
import ServiceModel from "@/models/ServiceModel";
import { reactive } from "@vue/runtime-core";
import * as d3 from "d3";
import {store as d3store} from './D3Store'
import {apiStore} from '@/api/api'
import {NodeApis} from '@/api/NodesApi'


export const store ={
    state : reactive({
        nodes: new Map<string, NodeModel>(),
        tags : new Set<string>(),
        currentObjectNode : null as NodeModel | null,
        filter : {
          tags : new Set<string>()
        }
    }),

    async loadNodes(){
      const nodes = await NodeApis.getNodes(apiStore.state.currentGraph.id as string);
      nodes.forEach((element : any) => {
        this.state.nodes.set(element.id, element);
      });
      console.log(nodes);
      d3store.createGraph();
      
    },

    initialize() {  
        const radius = 50
        const width = window.outerWidth
        const height = window.outerHeight

        const esif = new ServiceModel("esif")
        const wa = new ServiceModel("web admin")
        const rs = new ServiceModel("Reward service")

        this.state.nodes.set(esif.id, esif)
        this.state.nodes.set(wa.id, wa)
        this.state.nodes.set(rs.id, rs)
  
        this.state.nodes.forEach((v)=>{
          v.x = Math.random() * (width - radius * 2) + radius;
          v.y = Math.random() * (height - radius * 2) + radius;
        })

        this.createConnection(wa.id, rs.id);
        this.createConnection(esif.id, rs.id);
        this.createConnection(wa.id, esif.id);

        this.getTags()

        apiStore.getGraph();
      },

    addNode(node : NodeModel){
      this.state.nodes.set(node.id, node)
      this.addTags(node.tags)
    },

    addTag(tag : string){
      if(!this.state.tags.has(tag))
      this.state.tags.add(tag)
    },

    addTags(tags : string[]){
      tags.map((tag) => this.addTag(tag))
    },

    getNodes() : NodeModel[]  {      
      let arr = Array.from(this.state.nodes.values())
      const newArr : Map<string, NodeModel> = new Map()
      //filter is anything 
      if(this.state.filter.tags.size != 0){
        
        arr.forEach((node, index) => {
          // call filter on the node 
          node.tags.forEach((tag, idx) =>{
            if(this.state.filter.tags.has(tag)){
              newArr.set(node.id, node)
            }
          })

        })

        arr =Array.from( newArr.values())
        
      }
      return arr
    },

    createConnection(sourceId : string, targetId : string){
      const source = (this.state.nodes.get(sourceId) as ServiceModel)
      source.connections.push(targetId)
    },

    getNode(id : string) : NodeModel | undefined{
      return this.getNodes().find(p => p.id == id)
    },

    getNamebuId(id : string) : string | undefined{
      return this.getNode(id)?.name
    },

    getLinks() : Array<Links>{
      const link : Links[][] = [];
      const nodes = this.getNodes()
      nodes.forEach((node, key) => {
        if(node.type.isService()){          
          let linksInArray =  (node as ServiceModel).connections.map((connection, index) => {
            if(nodes.includes(node) && nodes.includes(this.getNode(connection) || new NodeModel())){
              return <Links>{
                source : node,
                target: this.getNode(connection)
              }
            }
          })
          
         linksInArray =  linksInArray.filter( p => {

            return p != undefined
          })
          // if(!linksInArray.includes(undefined)){
            link.push(linksInArray as any )
          // }
        }
      })
          
      return link.flat();
    },

    getTags() : Array<string>{
      const _tags : string[][] = [];
      this.state.nodes.forEach((node, key) => {          
          const linksInArray =  node.tags.map((tag, index) => {
            return tag
          })
          _tags.push(linksInArray)
      })
    
      this.state.tags = new Set(_tags.flat())
      return Array.from(this.state.tags);
    },

    updateNode(node : NodeModel) : NodeModel{
        let n : NodeModel | null= null;
        if(node.type.isDatabase()) n = new DatabaseModel(node.name, node)
        if(node.type.isService()) n = new ServiceModel(node.name, node)
        
        this.addNode(n!)
        d3store.createGraph();
        return n!;
      // should update graph
    },

    filterByTag(tag : string[]) {      
      this.state.filter.tags = new Set(tag)
      d3store.createGraph()
    }
}

export interface Links{
  source : NodeModel,
  target : NodeModel
}

store.initialize()