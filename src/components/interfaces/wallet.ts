export interface WalletInterface {
    name: string;
    address: string;
    options: {
        notifySend: boolean;
        notifyReceive: boolean;
        notifyTransferAsset: boolean;
        notifySellOrder: boolean;
        notifyPlaceBuy: boolean;
        notifySendBittrex: boolean;
        notifyReceiveBittrex: boolean;
        notifyReceivePoloniex: boolean;
    };
}