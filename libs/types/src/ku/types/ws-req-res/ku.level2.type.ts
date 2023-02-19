import { CurrencyPair, KuUnsubscribe, KuWs, PriceSizeSeq } from "../common";

export type Level2_topic = '/market/level2';

export type KuWsReq_level2 = KuWs<
    'subscribe',
    {
        topic: `${Level2_topic}:${CurrencyPair}`; // | `${Level2_topic}${string}`,
        response: boolean,
    }
>;

export type KuWsReq_level2_unsubscribe = KuUnsubscribe<KuWsReq_level2>;

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
