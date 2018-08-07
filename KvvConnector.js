const axios = require("axios");

const paths = {
    searchByName: name => `stops/byname/${name}`,
    getStartsOfStopId: id => `departures/bystop/${id}`
}

class KvvConnector {
    constructor(){
        this.axios = axios.create({
            baseURL: 'https://live.kvv.de/webapp/',
            params: {
                key: '377d840e54b59adbe53608ba1aad70e8'
            }
        })
    }
    searchByName(name){
        return this.axios(paths.searchByName(name))
    }
    getStartsOfStopId(id){
        return this.axios(paths.getStartsOfStopId(id))
    }
}

module.exports = KvvConnector;