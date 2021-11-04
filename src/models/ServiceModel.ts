import NodeType, { SubEnum } from "@/enums/NodeEnum";
import IpAddressModel from "./ipAddressModel";
import NodeModel from "./node";

export default class ServiceModel extends NodeModel{
    type = NodeType.SERVICE
    ipAddresses : IpAddressModel[] = []
    connections : string[] = [];

    constructor(name?:string, node?:NodeModel){
        super(name, node)        
        if(node){
            if(node.type.isService()){
                this.ipAddresses = (node as ServiceModel).ipAddresses || []
                this.connections = (node as ServiceModel).connections || []
            }
        }
    }
}