import { KuWs } from "../common/ku.ws.type";


export type KuWsReq_ping = KuWs<
    Record<string, never>,
    'ping'
>

export type KuWsRes_pong = KuWs<
    Record<string, never>,
    'pong'
>;


