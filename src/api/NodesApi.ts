import { SubEnum } from "@/enums/NodeEnum";
import axios from "axios";

const endpoint = "http://localhost:8081/graphs/";
const operations = {
    getNodes : `${endpoint}`
}

export const NodeApis = {

    async getNodes(graphId : string){
        try{
            const result = await axios.get(`${operations.getNodes}${graphId}/nodes`)
            return result.data.data;
        }catch(e){
            console.log(e);
            
        }
    },

    async addNode(graphId:string, node : any){
        try{
            console.log(graphId, node);
            axios.defaults.headers.common = {}

            const en = new SubEnum(node.type.value);
            node.type = en.value
            
            const result = await axios.post(`${operations.getNodes}${graphId}/nodes`, node,);
            console.log(result, "res");
            const data = result.data.data;
            return Promise.resolve(data)
            
        }catch(e){
            console.log(e);
            return Promise.reject("could not create node")
            
        }
    },

    
    async updateNode(graphId:string, node : any){
        try{
            console.log(graphId, node);
            axios.defaults.headers.common = {}
            
            const result = await axios.post(`${operations.getNodes}${graphId}/nodes`, node,);
            console.log(result, "res");
            const data = result.data.data;
            return Promise.resolve(data)
            
        }catch(e){
            console.log(e);
            return Promise.reject("could not create node")
            
        }
    },


     


}