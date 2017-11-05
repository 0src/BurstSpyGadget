/**
 * Server Interfaces
 * @version 1.0.0
 * @author Zeus <https://github.com/GoldZeus>
 */
import {BurstResponseGlobalInterface} from "./global";

export interface BlockResponse extends BurstResponseGlobalInterface {
    previousBlockHash: string;
    payloadLength: number;
    totalAmountNQT: string;
    generationSignature: string;
    generator: string;
    generatorPublicKey: string;
    baseTarget: string;
    payloadHash: string;
    generatorRS: string;
    blockReward: string;
    scoopNum: number;
    numberOfTransactions: number;
    blockSignature: string;
    transactions: string[];
    nonce: string;
    version: number;
    totalFeeNQT: string;
    previousBlock: string;
    block: string;
    height: number;
    timestamp: number;
}