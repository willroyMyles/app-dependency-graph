import NodeType from "../enums/NodeEnum"; 
import NodeModel from "./node";

export default class DatabaseModel extends NodeModel{
    type = NodeType.DATABASE
    address : string | null
    connectionString : string

    constructor(name? : string, node? : NodeModel){
        super(name, node);
        this.address = null;
        this.connectionString = ""

        if(node){
            if(node.type.isDatabase()){
                this.address = (node as DatabaseModel).address
                this.connectionString = (node as DatabaseModel).connectionString
            }
        }
    }

}