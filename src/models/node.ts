import NodeType, { SubEnum } from "@/enums/NodeEnum";
import {uuid} from "vue-uuid";
import DatabaseModel from "./databaseModel";
import IpAddressModel from "./ipAddressModel";

export default class NodeModel {
    id = uuid.v4()
    name : string
    x : number
    y : number
    type : SubEnum
    tags : string[]
    
    constructor(name = "random", node?:NodeModel){
        this.x = node?.x  ||   0.0;
        this.y = node?.y  ||   0.0;
        this.name = node?.name  ||   name;
        this.type = node?.type  ||   NodeType.SERVICE;
        this.tags = node?.tags  ||   []
    }


}
