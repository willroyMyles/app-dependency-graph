import axios from "axios"

const endpoint = "http://localhost:8081/";
const operations = {
    getGraph : `${endpoint}graphs`
}


export const apiStore = {
    createGraph(){
        // no
    },
    async getGraph(id : string | null = null) {

        try{
            const res = await axios.get(operations.getGraph);
            console.log(res);
            

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