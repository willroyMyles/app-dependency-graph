import NodeType, { SubEnum } from "@/enums/NodeEnum";
import DatabaseModel from "./databaseModel";
import IpAddressModel from "./ipAddressModel";
import NodeModel from "./node";

export default class ServiceModel extends NodeModel{
    type = NodeType.SERVICE
    ipAddresses : IpAddressModel[] = []
    connections : string[] = [];

    constructor(name?:string, node?:NodeModel){
        super(name)

        if(node){
            this.id = node.id
            this.name = node.name
            this.x = node.x
            this.y = node.y
        }
    }
}