import { KuWs } from "../common/ku.ws.type";


export type KuWsReq_ping = KuWs<
    Record<never, unknown>,
    'ping'
>

export type KuWsRes_pong = KuWs<
    Record<never, unknown>,
    'pong'
>;


