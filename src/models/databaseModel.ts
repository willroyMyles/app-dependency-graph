import { NodeType } from "@/enums/NodeEnum";
import NodeModel from "./node";

export default class DatabaseModel extends NodeModel{
    type = NodeType.DATABASE

    address : string | null

    constructor(){
        super();
        this.address = null;
    }

}