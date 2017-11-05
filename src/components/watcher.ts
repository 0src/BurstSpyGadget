import {walletsComponent} from "./wallets";
import {WalletInterface} from "./interfaces/wallet";
import {accountsApi} from "../burst/accounts";
import {AccountTransactionsInterface, TransactionInterface} from "../burst/interfaces/accounts";
import {utils} from "../helpers/utils";
import {history} from "../helpers/history";
import {assetExchangeApi} from "../burst/assets";
import {AssetInterface} from "../burst/interfaces/assets";
import {serverInfoApi} from "../burst/server";

enum TYPES {
    PAYMENT = 0,
    ASSET_EXCHANGE = 2
}

enum ASSET_SUBTYPES {
    ASSET_TRANSFER = 1,
    ASSET_SELL = 2,
    ASSET_BUY = 3
}

enum EXCHANGES {
    POLONIEX = 'BURST-R8SQ-TUEM-DTHQ-7ATA3',
    BITTREX = 'BURST-HK9D-P74Q-XDEJ-D6PGM'
}

class WatcherComponent {
    lastCheck: number;

    watch() {
        serverInfoApi.getTime().then((response: {time: number, requestProcessingTime: number}) => {
            // If it's the first time it's called set to the current time.
            if(!this.lastCheck) this.lastCheck = response.time;

            // Only get the wallets that have a valid burst address.
            const wallets = walletsComponent.getWallets().filter((wallet: WalletInterface) => {
                return wallet.address.length && /^BURST-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{5}$/.test(wallet.address)
            });

            // +(''+this.lastCheckup) is done to prevent any "link" with the current lastCheckup.
            this.watchWallets(wallets, +(''+this.lastCheck)).catch(e => console.log(e));

            // Only set to the current time after the watch is done (for the next call).
            this.lastCheck = response.time;
        });
    }

    private watchWallets(wallets: WalletInterface[], timestamp, index = 0) {
        return new Promise((resolve, reject) => {
            if(wallets.length <= index) return resolve();

            const wallet = wallets[index];

            accountsApi.getAccountTransactions(wallet.address, timestamp).then((result: AccountTransactionsInterface) => {
                this.watchTransactions(wallet, result.transactions).then(() => {
                    this.watchWallets(wallets, timestamp, ++index);

                }).catch(e => console.log(e));
            }).catch(e => {
                console.log(e);
            });
        });
    }

    private watchTransactions(wallet: WalletInterface, transactions: TransactionInterface[], index = 0) {
        return new Promise((resolve, reject) => {
            if(!transactions || transactions.length <= index) return resolve();

            const transaction = transactions[index];

            // Ignore this transaction if it's not of one of the required types.
            if(transaction.type !== TYPES.PAYMENT && transaction.type !== TYPES.ASSET_EXCHANGE) {
                return this.watchTransactions(wallet, transactions, ++index);
            }

            // Received / Sent Burst
            if(transaction.type === TYPES.PAYMENT) {
                const amount = utils.toEightDecimals(+transaction.amountNQT / 100000000);
                if(transaction.senderRS === EXCHANGES.POLONIEX && wallet.options.notifyReceivePoloniex) {
                    const body = `Received ${amount}BURST from POLONIEX`;
                    new Notification(wallet.name, {body});

                    history.update(wallet.name, `${new Date().toLocaleString()} | ${body}. Transaction = ${transaction.transaction}. Block height = ${transaction.height}`);

                } else if(transaction.senderRS === EXCHANGES.BITTREX && wallet.options.notifyReceiveBittrex) {
                    const body = `Received ${amount}BURST from BITTREX`;
                    new Notification(wallet.name, {body});

                    history.update(wallet.name, `${new Date().toLocaleString()} | ${body}. Transaction = ${transaction.transaction}. Block height = ${transaction.height}`);

                } else if(transaction.recipientRS === EXCHANGES.BITTREX && wallet.options.notifySendBittrex) {
                    const body = `Sent ${amount}BURST to BITTREX`;
                    new Notification(wallet.name, {body});

                    history.update(wallet.name, `${new Date().toLocaleString()} | ${body}. Transaction = ${transaction.transaction}. Block height = ${transaction.height}`);

                } else if(transaction.senderRS === wallet.address && wallet.options.notifySend) {
                    const body = `Sent ${amount}BURST to ${transaction.recipientRS}`;
                    new Notification(wallet.name, {body});

                    history.update(wallet.name, `${new Date().toLocaleString()} | ${body}. Transaction = ${transaction.transaction}. Block height = ${transaction.height}`);

                } else if(wallet.options.notifyReceive) {
                    const body = `Received ${amount}BURST from ${transaction.senderRS}`;
                    new Notification(wallet.name, {body});

                    history.update(wallet.name, `${new Date().toLocaleString()} | ${body}. Transaction = ${transaction.transaction}. Block height = ${transaction.height}`);

                }

                return this.watchTransactions(wallet, transactions, ++index);
            }

            // Asset Exchange
            if(transaction.type === TYPES.ASSET_EXCHANGE) {
                assetExchangeApi.getAsset(transaction.attachment.asset).then((asset: AssetInterface) => {
                    const quantity = asset.decimals > 0? +transaction.attachment.quantityQNT / Math.pow(10, 8 - asset.decimals) : transaction.attachment.quantityQNT;

                    if(transaction.subtype === ASSET_SUBTYPES.ASSET_BUY && wallet.options.notifyPlaceBuy) {
                        const amount = utils.toEightDecimals(+transaction.attachment.priceNQT / 100000000);
                        const body = `Placed BUY order for ${asset.name} of ${quantity} shares at ${amount}BURST`;
                        new Notification(wallet.name, {body });

                        history.update(wallet.name, `${new Date().toLocaleString()} | ${body}. Transaction = ${transaction.transaction}. Block height = ${transaction.height}`);

                    } else if(transaction.subtype === ASSET_SUBTYPES.ASSET_SELL && wallet.options.notifySellOrder) {
                        const amount = utils.toEightDecimals(+transaction.attachment.priceNQT / 100000000);
                        const body = `Placed SELL order for ${asset.name} of ${quantity} shares at ${amount}BURST`;
                        new Notification(wallet.name, {body });

                        history.update(wallet.name, `${new Date().toLocaleString()} | ${body}. Transaction = ${transaction.transaction}. Block height = ${transaction.height}`);

                    } else if(transaction.recipientRS !== wallet.address && wallet.options.notifyTransferAsset) {
                        const body = `Transfered asset ${asset.name}, ${quantity} shares to ${transaction.recipientRS}`;
                        new Notification(wallet.name, {body });

                        history.update(wallet.name, `${new Date().toLocaleString()} | ${body}. Transaction = ${transaction.transaction}. Block height = ${transaction.height}`);
                    }

                    return this.watchTransactions(wallet, transactions, ++index);
                });
            }
        });
    }
}
export const watcherComponent = new WatcherComponent();