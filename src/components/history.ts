/**
 * History modal handler
 */

import * as path from 'path';
import * as fs from 'fs';
import * as $ from 'jquery';
import {walletsComponent} from "./wallets";
import {WalletInterface} from "./interfaces/wallet";
import {history} from "../helpers/history";

class HistoryComponent {
    private $btnHistory;
    private $historyModal;
    private $historyData;

    init() {
        console.log('Initializing HistoryComponent...');

        this.initJQuery();
        this.events();
    }

    private initJQuery() {
        this.$btnHistory = $('.js-btn-history');
        this.$historyModal = $('#historyModal');
        this.$historyData = $('.js-history-data');
    }

    private showHistory() {
        const currentWallet: WalletInterface = walletsComponent.getCurrentWallet();

        history.get(currentWallet.name).then(data => {
            this.$historyData.val(data);

            this.$historyModal.modal('open');
        }).catch(e => {
           console.log(e);

           this.$historyData.val('Nothing to show for this wallet.');

           this.$historyModal.modal('open');
        });
    }

    private events() {
        this.$btnHistory.on('click', e => {
            e.preventDefault();

            this.showHistory();
        });
    }
}
export const historyComponent = new HistoryComponent();