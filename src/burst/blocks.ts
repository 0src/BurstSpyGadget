import {BurstApi} from "./burst";

class BlocksApi extends BurstApi {

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

export const blocksApi = new BlocksApi();