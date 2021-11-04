import NodeType, { SubEnum } from "@/enums/NodeEnum";
import IpAddressModel from "./ipAddressModel";
import NodeModel from "./node";

export default class ServiceModel extends NodeModel{
    type = NodeType.SERVICE
    ipAddresses : IpAddressModel[] = []
    connections : string[] = [];

    constructor(name?:string, node?:NodeModel){
        super(name)

        console.log(node);
        
        if(node){
            this.id = node.id
            this.name = node.name
            this.x = node.x
            this.y = node.y

            if(node.type.isService()){
                this.ipAddresses = (node as ServiceModel).ipAddresses || []
                this.connections = (node as ServiceModel).connections || []
            }
        }
    }
}