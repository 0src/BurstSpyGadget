"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const burst_1 = require("./burst");
class BlocksApi extends burst_1.BurstApi {
    /**
     * Get a block from the blockchain, if params not set, it will return the latest block
     * @param {string} block
     * @param {number} height
     * @param {number} timestamp
     * @param {boolean} includeTransactions
     * @returns {Promise}
     */
    getBlock() {
        const data = {
            requestType: 'getBlock'
        };
        return this.get(data);
    }
}
exports.blocksApi = new BlocksApi();
