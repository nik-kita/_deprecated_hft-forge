import { KuWsReqType } from "./ku.ws-req-type.type";
import { KuWsResType } from "./ku.ws-res-type.type";

export type KuWs<
D extends object,
T extends (KuWsReqType | KuWsResType) = 'message'
> = {
    id: string,
    type: T,
} & D;

