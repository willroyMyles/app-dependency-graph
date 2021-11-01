import { NodeType } from "@/enums/NodeEnum";
import DatabaseModel from "./databaseModel";
import IpAddressModel from "./ipAddressModel";
import NodeModel from "./node";

export default class ServiceModel extends NodeModel{
    type = NodeType.SERVICE
    ipAddresses : IpAddressModel[] = []
    connections : string[] = [];
}