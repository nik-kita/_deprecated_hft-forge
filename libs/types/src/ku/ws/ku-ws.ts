import { CurrencyPair } from "../core";

export type KuWs = {
    ACK: {
        PUB: never,
        SUB: {
            PAYLOAD: {
                id: string,
                type: 'ack',
            },
        },
    },
    WELCOME: {
        PUB: never,
        SUB: {
            PAYLOAD: {
                id: string,
                type: 'welcome',
            },
        },
    },
    PING_PONG: {
        PUB: {
            PAYLOAD: {
                id: string,
                type: 'ping',
            },
            _PAYLOAD: {
                id: string,
                type: 'ping',
            },
        },
        SUB: {
            PAYLOAD: {
                id: string,
                type: 'pong',
            },
        },
    },
    /**
     * Only channels below have business logic. Channels above are technical.
     */
    LEVEL_2: {
        PUB: {
            PAYLOAD: {
                id: string | number,
                type: 'subscribe' | 'unsubscribe',
                topic: `/market/level2:${string}`,
                privateChannel: boolean,
                response: boolean,
            },
            _PAYLOAD: {
                id: string | number,
                type: 'subscribe' | 'unsubscribe',
                privateChannel: boolean,
                response: true,
                topic_first_part: '/market/level2:',
                topic_second_splitted_by_comma_part: CurrencyPair[],
            },
        },
        SUB: {
            PAYLOAD: {
                type: 'message',
                topic: `${'/market/level2:'}${CurrencyPair}`,
                subject: 'trade.l2update',
                data: {
                    sequenceEnd: number,
                    sequenceStart: number,
                    symbol: CurrencyPair,
                    time: number,
                    changes: {
                        asks: [string, string, string][],
                        bids: [string, string, string][],
                    },
                },
            },
        },
    },
};
export type AnyChannel = keyof KuWs;
export type Channel = Exclude<AnyChannel, keyof Pick<Record<AnyChannel, never>, 'PING_PONG' | 'WELCOME' | 'ACK'>>;
export type KuPub<T extends AnyChannel = Channel> = KuWs[T]['PUB'];
export type KuSub<T extends AnyChannel = Channel> = KuWs[T]['SUB'];
