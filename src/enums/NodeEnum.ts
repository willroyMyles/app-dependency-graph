import {Enumify} from 'enumify-ts'
export class SubEnum{
    value : string ;
    isDatabase = () => this.value == "DATABASE"
    isService = () => this.value == "SERVICE"

    constructor(val : string){
        this.value = val;
    }
}

export  default class NodeType extends Enumify<SubEnum>(){
    static SERVICE = new SubEnum("SERVICE")
    static DATABASE = new SubEnum("DATABASE")

    constructor(){
        super()
        NodeType._closeEnum()
    }
}


