import NodeType, { SubEnum } from "@/enums/NodeEnum";
import DatabaseModel from "@/models/databaseModel";
import NodeModel from "@/models/node";
import ServiceModel from "@/models/ServiceModel";
import { reactive } from "@vue/runtime-core";
import * as d3 from "d3";
import {store as d3store} from './D3Store'
import {apiStore} from '@/api/api'
import {NodeApis} from '@/api/NodesApi'
import { getType, isDatabase, isService } from "@/helper/Helper";


export const store ={
    state : reactive({
        nodes: new Map<string, any>(),
        tags : new Set<string>(),
        currentObjectNode : null as NodeModel | null,
        filter : {
          tags : new Set<string>()
        }
    }),

    async loadNodes(){
      const nodes = await NodeApis.getNodes(apiStore.state.currentGraph.id as string);
      nodes.forEach((element : any) => {
        element.type = getType(element.type);
        console.log(element, getType(element.type));
        
        this.state.nodes.set(element.id, element);
      });
      console.log(nodes);
      this.initialize();
      d3store.createGraph();
      
    },

    initialize() {  
        const radius = 50
        const width = window.outerWidth
        const height = window.outerHeight
  
        this.state.nodes.forEach((v)=>{
          v.x = Math.random() * (width - radius * 2) + radius;
          v.y = Math.random() * (height - radius * 2) + radius;
        })

        this.getTags()
      },

    async addNode(node : NodeModel){
      const createdNode = await NodeApis.addNode(apiStore.state.currentGraph.id, node);
      this.state.nodes.set(createdNode.id, createdNode)
      this.addTags(node.tags)
      d3store.createGraph();
    },

    addNodeTograph(node : NodeModel){
      this.state.nodes.set(node.id, node)
      this.addTags(node.tags)
      d3store.createGraph();
    },

    addTag(tag : string){
      if(!this.state.tags.has(tag))
      this.state.tags.add(tag)
    },

    addTags(tags : string[]){
      tags.map((tag) => this.addTag(tag))
    },

    getNodes() : any[]  {      
      let arr = Array.from(this.state.nodes.values())
      const newArr : Map<string, any> = new Map()
      //filter is anything 
      if(this.state.filter.tags.size != 0){
        
        arr.forEach((node, index) => {
          // call filter on the node 
          node.tags.forEach((tag : string, idx : number) =>{
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
        if(isService(node.type)){          
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
          const linksInArray =  node.tags.map((tag : string, index : number) => {
            return tag
          })
          _tags.push(linksInArray)
      })
    
      this.state.tags = new Set(_tags.flat())
      return Array.from(this.state.tags);
    },

    async updateNode(node : any) : Promise<any>{

        const n = await NodeApis.updateNode(apiStore.state.currentGraph.id, node);
        
        this.addNodeTograph(n)
        return Promise.resolve(n);
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

// store.initialize()