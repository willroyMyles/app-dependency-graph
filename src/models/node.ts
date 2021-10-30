import {uuid} from "vue-uuid";
import DatabaseModel from "./databaseModel";
import IpAddressModel from "./ipAddressModel";

export default class NodeModel {
    id = uuid.v4()
    name : string
    x : number
    y : number
    hasDatabase = false
    databaseModel : DatabaseModel | null
    ipAddresses : IpAddressModel[] = []
    downStream : string[] = [];
    
    
    constructor(name = "random"){
        this.x = 0.0;
        this.y = 0.0;
        this.name = name;
        this.databaseModel = null
    }
}