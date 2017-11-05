import {BurstApi} from "./burst";

class ServerInfoApi extends BurstApi {

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

export const serverInfoApi = new ServerInfoApi();