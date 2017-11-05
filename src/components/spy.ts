/**
 * Wallet options and page content details.
 */
import * as $ from 'jquery';
import {WalletInterface} from "./interfaces/wallet";
import {walletsComponent} from "./wallets";

class SpyComponent {
    private $walletName;
    private $walletAddress;
    private $options;
    private currentWallet: WalletInterface;

    init() {
        console.log('Initializing SpyComponent...');

        this.initjQuery();
        this.events();
    }

    update(wallet: WalletInterface) {
        this.currentWallet = wallet;

        this.$walletName.val(wallet.name === 'UNKNOWN NAME'? '' : wallet.name);
        this.$walletAddress.val(wallet.address);

        for(let key in wallet.options) {
            $(`#${key}`).prop('checked', wallet.options[key]);
        }
    }

    private initjQuery() {
        this.$walletName = $('#walletName');
        this.$walletAddress = $('#walletAddress');
        this.$options = $('.js-spy-options').find('input[type="checkbox"]');
    }
    private events() {
        this.$walletName.on('keyup', e => {
            this.currentWallet.name = $.trim($(e.target).val());

            walletsComponent.update(this.currentWallet);
        });

        this.$walletAddress.on('keyup', e => {
            this.currentWallet.address = $.trim($(e.target).val());

            walletsComponent.update(this.currentWallet);
        });

        this.$options.on('change', e => {
            const $this = $(e.target);
            this.currentWallet.options[$this.attr('id')] = $this.is(':checked');

            walletsComponent.update(this.currentWallet);
        });
    }
}

export const spyComponent = new SpyComponent();