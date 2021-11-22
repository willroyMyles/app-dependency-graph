import { reactive } from "@vue/runtime-core";
import axios from "axios"

const endpoint = "http://localhost:8081/";
const operations = {
    getGraph : `${endpoint}graphs`
}


export const apiStore = {
    state : reactive({
        graphs : [] as any[],
        currentGraph : {}
    }),
    _setGraphs(graphs : any[]){
        this.state.graphs = graphs;
        console.log(this.state.graphs);
        
    },
    createGraph(){
        // no
    },
    async getGraph(id : string | null = null) {

        try{
            const res = await axios.get(operations.getGraph);
            this._setGraphs(res.data.data)
            
        }catch(e){
            console.log(e);
            
        }
    },
    updateGraph(id:string){
        // no
    },
    deleteGraph(id:string){
        // no
    }
}