import {
    CLOSED, CLOSING, CONNECTING,
    OPEN
} from 'ws';


export type WsReadyState = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED';
export const WS_READY_STATE_K_V = {
    CONNECTING,
    OPEN,
    CLOSING,
    CLOSED,
} as const;
export type WsReadyStateKV = typeof WS_READY_STATE_K_V;
export type WsReadyStateVK = {
    0: 'CONNECTING',
    1: 'OPEN',
    2: 'CLOSING',
    3: 'CLOSED',
};
export const WS_READY_STATE_V_K = Object.entries(WS_READY_STATE_K_V)
    .reduce((acc, [k, v]) => {
        (acc as any)[v] = k;

        return acc;
    }, {} as WsReadyStateVK);

