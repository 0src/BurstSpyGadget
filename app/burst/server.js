"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const burst_1 = require("./burst");
class ServerInfoApi extends burst_1.BurstApi {
    /**
     * Get current blockchain time
     * @returns {Promise}
     */
    getTime() {
        const data = {
            requestType: 'getTime'
        };
        return this.get(data);
    }
}
exports.serverInfoApi = new ServerInfoApi();
