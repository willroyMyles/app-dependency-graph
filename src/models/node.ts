import {uuid} from "vue-uuid";

export default class NodeModel {
    id = uuid.v4()
    name : string
    x : number
    y : number
    
    constructor(name = "random"){
        this.x = 0.0;
        this.y = 0.0;
        this.name = name;
    }
}