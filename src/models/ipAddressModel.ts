export default class IpAddressModel {
    private name : string 
    private ipAddress : string
    private hostName : string | null

    constructor({name, ipAddress, hostName} : {name : string, ipAddress : string, hostName : string}){
        this.name = name
        this.ipAddress = ipAddress
        this.hostName = hostName
    }

}