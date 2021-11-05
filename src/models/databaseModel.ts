import NodeType from "../enums/NodeEnum"; 
import NodeModel from "./node";

export default class DatabaseModel extends NodeModel{
    type = NodeType.DATABASE
    address : string | null
    connectionString : string

    constructor(name? : string, node? : NodeModel){
        super(name);
        this.address = null;
        this.connectionString = ""

        if(node){
            this.id = node.id
            this.name = node.name
            this.x = node.x
            this.y = node.y

            if(node.type.isDatabase()){
                this.address = (node as DatabaseModel).address
                this.connectionString = (node as DatabaseModel).connectionString
            }
        }
    }

}