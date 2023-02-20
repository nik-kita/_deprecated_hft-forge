import { CurrencyPair } from "../common";

type Headers = {
    'KC-API-SIGN': string,
    'KC-API-TIMESTAMP': string,
    'KC-API-KEY': string,
    'KC-API-PASSPHRASE': string,
    'KC-API-KEY-VERSION': '2',
    'Content-Type': 'application/json',
}

type URL = 'https://api.kucoin.com';


type KuHttp = {
    '/api/v1/bullet-public': {
        url: `${URL}/api/v1/bullet-public`,
        req: {
            method: 'POST',
            query?: never,
            body?: never,
            headers?: never,
        },
        res: {
            code: "200000",
            data: {
                token: string,
                instanceServers: {
                    endpoint: "wss://ws-api-spot.kucoin.com/",
                    encrypt: true,
                    protocol: "websocket",
                    pingInterval: number,
                    pingTimeout: number,
                }[],
            },
        },
    },
    '/api/v1/bullet-private': {
        url: `${URL}/api/v1/bullet-private`,
        req: {
            method: 'POST',
            query?: never,
            body?: never,
            headers: Headers,
        },
        res: {
            code: "200000",
            data: {
                token: string,
                instanceServers: {
                    endpoint: "wss://ws-api-spot.kucoin.com/",
                    encrypt: true,
                    protocol: "websocket",
                    pingInterval: number,
                    pingTimeout: number,
                }[],
            }
        },
    },
    '/api/v3/market/orderbook/level2': {
        url: `${URL}/api/v3/market/orderbook/level2`,
        req: {
            method: 'GET',
            query: { symbol: CurrencyPair },
            body?: never,
            headers: Headers,
        },
        res: {
            type: 'message',
            topic: string,
            subject: 'trade.l2update',
            data: {
                changes: {
                    asks: [string, string, string],
                    bids: [string, string, string],
                },
                sequenceEnd: number,
                sequenceStart: number,
                symbol: CurrencyPair,
                time: number,
            },
        },
    },
};

export type Endpoint = keyof KuHttp;
export type KuReq<T extends Endpoint = Endpoint> = [
    KuHttp[T]['req']['headers'] extends never | void
    ? { url: KuHttp[T]['url'] }
    : {
        url: KuHttp[T]['url'],
        forSignature: {
            endpoint: T,
        } & Omit<KuHttp[T]['req'],
            Exclude<keyof KuHttp[T]['req'], keyof Partial<KuHttp[T]['req']>>
            | 'headers'>
    },
    Omit<KuHttp[T]['req'],
        Exclude<keyof KuHttp[T]['req'], keyof Partial<KuHttp[T]['req']>>>
];
export type KuRes<T extends Endpoint = Endpoint> = KuHttp[T]['res'];
