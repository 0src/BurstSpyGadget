/**
 * Accounts Interface
 * @version 1.0.0
 * @author Zeus <https://github.com/GoldZeus>
 */

import {BurstResponseGlobalInterface} from "./global";

export interface TransactionInterface {
    senderPublicKey: string;
    signature: string;
    feeNQT: string;
    type: number;
    confirmations: number;
    fullHash: string;
    version: number;
    ecBlockId: string;
    signatureHash: string;
    attachment: {
        "version.Message": number;
        "version.BidOrderPlacement": number;
        "version.AssetTransfer": number;
        asset: string;
        quantityQNT: string;
        priceNQT: string;
        "messageIsText": boolean;
        message: string;
    }
    senderRS: string;
    subtype: number;
    amountNQT: string;
    sender: string;
    recipientRS: string;
    recipient: string;
    ecBlockHeight: number;
    block: string;
    blockTimestamp: number;
    deadline: number;
    transaction: string;
    timestamp: number;
    height: number;
}

export interface AccountTransactionsInterface extends BurstResponseGlobalInterface {
    transactions: TransactionInterface[];
}