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
    }
}