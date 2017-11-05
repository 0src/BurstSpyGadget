"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Materialize = require("materialize-css");
const burst_1 = require("../burst/burst");
const blocks_1 = require("../burst/blocks");
const database_1 = require("../helpers/database");
const watcher_1 = require("./watcher");
class ServersComponent {
    constructor() {
        this.firstCall = true;
        this.storageKey = 'server.config';
        this.currentWallet = '';
        this.latestHeight = 0;
        burst_1.burstApiConfig.wallets = burst_1.defaultWallets;
        database_1.database.get(this.storageKey).then((data) => {
            if (!data.length)
                return;
            this.setWallet(data);
        }).catch(err => {
            console.log(err);
        });
    }
    /**
     * Called when App.init() is called.
     * @returns {Promise}
     */
    init() {
        console.log('Initializing ServersComponent...');
        this.initjQuery();
        this.events();
        this.$inputServerUrl.val(this.currentWallet);
        return this.getBlockInfo();
    }
    getBlockInfo() {
        return new Promise((resolve, reject) => {
            blocks_1.blocksApi.getBlock().then((block) => {
                this.$server.text(burst_1.burstApiConfig.currentWallet.replace(/(^\w+:|^)\/\//, '').split(':')[0]);
                if (this.latestHeight !== block.height) {
                    watcher_1.watcherComponent.watch();
                    this.$height.text(block.height);
                    this.latestHeight = block.height;
                }
                if (this.firstCall) {
                    this.$connecting.hide();
                    this.$connected.show();
                    this.firstCall = false;
                }
                resolve();
            }).catch(e => {
                console.log(e);
                this.$server.text('Unable to connect to server...');
                this.$height.text('');
                if (this.firstCall) {
                    this.$connecting.hide();
                    this.$connected.show();
                    this.firstCall = false;
                }
                reject(e);
            });
        });
    }
    initjQuery() {
        this.$connecting = $('.js-wallet-connecting');
        this.$connected = $('.js-wallet-details');
        this.$server = $('.js-connected-server');
        this.$height = $('.js-block-height');
        this.$inputServerUrl = $('.js-server-url');
        this.$btnSaveServer = $('.js-update-server');
        this.$modalEditServer = $('#editServerModal');
    }
    setWallet(walletArr) {
        burst_1.burstApiConfig.wallets = walletArr;
        burst_1.burstApiConfig.currentWalletIndex = 0;
        burst_1.burstApiConfig.currentWallet = walletArr[0];
        this.currentWallet = walletArr[0];
        this.$inputServerUrl.val(this.currentWallet.split('/burst')[0]);
        this.getBlockInfo().catch(e => { console.log(e); });
    }
    saveWallet(walletArr) {
        database_1.database.set(this.storageKey, walletArr).then().catch(e => {
            console.log(e);
        });
        this.setWallet(walletArr);
    }
    clearWallets() {
        database_1.database.set(this.storageKey, []);
        this.setWallet(burst_1.defaultWallets);
        this.$inputServerUrl.val('');
        this.getBlockInfo().catch(e => { console.log(e); });
    }
    events() {
        this.$btnSaveServer.on('click', e => {
            e.preventDefault();
            let serverURI = $.trim(this.$inputServerUrl.val());
            if (this.$inputServerUrl.hasClass('invalid')) {
                return Materialize.toast('Incorrect wallet server.', 3000);
            }
            if (!serverURI.length) {
                this.clearWallets();
            }
            else {
                serverURI = serverURI.split('/index.html')[0];
                if (serverURI.indexOf(':') === -1) {
                    Materialize.toast('Missing :PORT', 3000);
                }
                if (serverURI.indexOf('/burst') === -1) {
                    serverURI += '/burst';
                }
                this.saveWallet([serverURI]);
            }
            this.$modalEditServer.modal('close');
        });
    }
}
exports.serversComponent = new ServersComponent();
