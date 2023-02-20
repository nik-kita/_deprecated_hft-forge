import { CurrencyPair } from "../common";

type KuWs = {
    ACK: {
        pub: never,
        sub: {
            payload: {
                id: string,
                type: 'ack',
            },
        },
    },
    WELCOME: {
        pub: never,
        sub: {
            payload: {
                id: string,
                type: 'welcome',
            },
        },
    },
    PING_PONG: {
        pub: {
            payload: {
                id: string,
                type: 'ping',
            },
        },
        sub: {
            payload: {
                id: string,
                type: 'pong',
            },
        },
    },
    LEVEL_2: {
        pub: {
            payload: {
                id: string | number,
                type: 'subscribe' | 'unsubscribe',
                topic: `/market/level2:${string}`,
                privateChannel: boolean,
                response: boolean,
            },
            _private: true,
            _topic_first_part: '/market/level2:',
            _topic_second_comma_splitted_part: [CurrencyPair, ...CurrencyPair[]],
        },
        sub: {
            payload: {
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
export type Channel = Exclude<AnyChannel, keyof Pick<Record<AnyChannel, never>, 'PING_PONG' | 'WELCOME'>>;

export type KuPub<T extends AnyChannel = Channel> = KuWs[T]['pub'];
export type KuSub<T extends AnyChannel = Channel> = KuWs[T]['sub'];
