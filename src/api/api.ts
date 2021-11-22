import { reactive } from "@vue/runtime-core";
import axios from "axios"

const endpoint = "http://localhost:8081/";
const operations = {
    getGraph : `${endpoint}graphs`
}


export const apiStore = {
    state : reactive({
        graphs : [] as any[],
        currentGraph : {} as any
    }),
    _setGraphs(graphs : any[]){
        this.state.graphs = graphs;
        console.log(this.state.graphs);
    },

    setCurrentGraph(idx : number){
        this.state.currentGraph = this.state.graphs[idx];
    },

    createGraph(){
        // no
    },
    async getGraph(id : string | null = null) : Promise<boolean> {

        try{
            const res = await axios.get(operations.getGraph);
            this._setGraphs(res.data.data)
            return Promise.resolve(true);
        }catch(e){
            console.log(e);
            return Promise.resolve(false);
        }
    },
    updateGraph(id:string){
        // no
    },
    deleteGraph(id:string){
        // no
    }
}