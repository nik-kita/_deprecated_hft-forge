import { CurrencyPair, KuWs, PriceSizeSeq, UsdtCurrency } from "../common";

export type Level2_topic = `/market/level2:${UsdtCurrency}`;

export type KuWsReq_level2 = KuWs<
    'subscribe',
    {
        topic: Level2_topic,
        response: boolean,
    }
>;

export type KuWsRes_level2 = KuWs<
    'message',
    {
        topic: Level2_topic,
        subject: 'trade.l2update',
        data: {
            changes: {
                asks: PriceSizeSeq[],
                bids: PriceSizeSeq[],
            },
            sequenceEnd: number,
            sequenceStart: number,
            symbol: CurrencyPair,
            time: number,
        },
    }
>;
