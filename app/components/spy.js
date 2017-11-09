"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Wallet options and page content details.
 */
const $ = require("jquery");
const wallets_1 = require("./wallets");
const history_1 = require("./history");
class SpyComponent {
    init() {
        console.log('Initializing SpyComponent...');
        history_1.historyComponent.init();
        this.initjQuery();
        this.events();
    }
    update(wallet) {
        this.currentWallet = wallet;
        this.$walletName.val(wallet.name === 'UNKNOWN NAME' ? '' : wallet.name);
        this.$walletAddress.val(wallet.address);
        for (let key in wallet.options) {
            $(`#${key}`).prop('checked', wallet.options[key]);
        }
    }
    initjQuery() {
        this.$walletName = $('#walletName');
        this.$walletAddress = $('#walletAddress');
        this.$options = $('.js-spy-options').find('input[type="checkbox"]');
    }
    events() {
        this.$walletName.on('keyup', e => {
            this.currentWallet.name = $.trim($(e.target).val());
            wallets_1.walletsComponent.update(this.currentWallet);
        });
        this.$walletAddress.on('keyup', e => {
            this.currentWallet.address = $.trim($(e.target).val());
            wallets_1.walletsComponent.update(this.currentWallet);
        });
        this.$options.on('change', e => {
            const $this = $(e.target);
            this.currentWallet.options[$this.attr('id')] = $this.is(':checked');
            wallets_1.walletsComponent.update(this.currentWallet);
        });
    }
}
exports.spyComponent = new SpyComponent();
