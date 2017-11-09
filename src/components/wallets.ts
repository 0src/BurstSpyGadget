/**
 * Sidebar handler and data saver.
 */
import {WalletInterface} from "./interfaces/wallet";
import {database} from "../helpers/database";
import {spyComponent} from "./spy";

import * as $ from 'jquery';

const newWalletData = {
    name: '',
    address: '',
    options: {
        notifySend: true,
        notifyReceive: true,
        notifyTransferAsset: true,
        notifySellOrder: true,
        notifyPlaceBuy: true,
        notifySendBittrex: true,
        notifyReceiveBittrex: true,
        notifyReceivePoloniex: true
    }
};

class WalletsComponent {
    private wallets: WalletInterface[] = [];
    private selectedWallet: WalletInterface;
    private selectedIndex: number = 0;

    private isSaving: boolean = false;

    private $sidebar;
    private $btnAddWallet;
    private $btnDeleteWallet;

    constructor() {
        database.get('wallets').then((wallets: WalletInterface[]) => {
            this.wallets = wallets;
        }).catch(e => {
            // New account
            console.log(e);
            
            this.wallets.push(JSON.parse(JSON.stringify(newWalletData)));
        });
    }

    init() {
        console.log('Initializing WalletsComponent...');
        spyComponent.init();

        this.initjQuery();
        this.events();

        this.wallets.forEach((wallet) => { this.addWalletToDom(wallet.name) });
        this.setWallet();
    }

    getCurrentWallet() {
        return this.selectedWallet;
    }

    getWallets() {
        return this.wallets;
    }

    update(wallet) {
        this.$sidebar.find('.active').find('a').text(wallet.name === ''? 'UNKNOWN NAME' : wallet.name);

        this.selectedWallet = wallet;
        this.wallets[this.selectedIndex] = wallet;

        this.save();
    }

    private save() {
        if(this.isSaving) {
            return setTimeout(() => { this.save(); }, 100);
        }
        this.isSaving = true;

        database.set('wallets', this.wallets).then(() => {
            this.isSaving = false;
        }).catch(e => {
            console.log(e);

            this.isSaving = false;
        });
    }

    private addWallet() {
        this.wallets.push(JSON.parse(JSON.stringify(newWalletData)));
        this.addWalletToDom();

        this.setWallet(this.wallets.length - 1);
    }

    private addWalletToDom(name = '') {
        if(name === '') {
            name = 'UNKNOWN NAME';
        }
        const $li = `<li><a href="#!">${name}</a></li>`;
        this.$sidebar.append($li);
    }

    private setWallet(index = this.selectedIndex) {
        this.selectedIndex = index;
        this.selectedWallet = this.wallets[index];

        this.$sidebar.find('.active').removeClass('active');
        this.$sidebar.find('li').eq(this.selectedIndex + 1).addClass('active');

        spyComponent.update(this.selectedWallet);
    }

    private deleteWallet(index = this.selectedIndex) {
        this.wallets.splice(index, 1);

        this.$sidebar.find('.active').remove();
        if(!this.wallets.length) {
            this.addWallet();
        } else {
            this.setWallet(0);
        }

        this.save();
    }

    private initjQuery() {
        this.$sidebar = $('.js-sidebar');
        this.$btnAddWallet = $('.js-add-wallet');
        this.$btnDeleteWallet = $('.js-delete-wallet');
    }

    private events() {
        this.$btnAddWallet.on('click', e => {
            e.preventDefault();

            this.addWallet();
        });

        this.$sidebar.on('click', 'a', e => {
            e.preventDefault();

            const $this = $(e.target).parent();
            if($this.hasClass('active') || $(e.target).hasClass('btn')) {
                return;
            }

            this.setWallet($this.index() - 1);
        });

        this.$btnDeleteWallet.on('click', e => {
            e.preventDefault();

            this.deleteWallet();
        });
    }
}

export const walletsComponent = new WalletsComponent();