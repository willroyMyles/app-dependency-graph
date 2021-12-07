import { NodeTypeEnum } from "@/enums/NodeEnum";

export const isService = (type : any) => type == "SERVICE";
export const isDatabase = (type : any) => type == "DATABASE";

export const getType = (type : string) => {
    
    if(type == null || type == undefined) return NodeTypeEnum.SERVICE
    return NodeTypeEnum.SERVICE
    
}

export const getImageForType = (type : NodeTypeEnum) : string => {
    switch(type){
        case NodeTypeEnum.SERVICE:
            return  "./assets/svg/app.svg";
        case NodeTypeEnum.DATABASE:
            return  "./assets/svg/db.svg";
        default :
            return  "./assets/svg/app.svg";
    }
}