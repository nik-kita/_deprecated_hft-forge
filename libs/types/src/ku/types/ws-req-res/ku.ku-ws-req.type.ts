import { KuWsReq_level2, KuWsReq_level2_unsubscribe } from "./ku.level2.type";
import { KuWsReq_ping } from "./ku.ping-pong.type";


export type KuWsReqSub = KuWsReq_level2;
export type KuWsReqUnsub = KuWsReq_level2_unsubscribe;
export type KuWsSubscription = KuWsReqSub | KuWsReqUnsub;
export type KuWsReq = KuWsSubscription | KuWsReq_ping;
