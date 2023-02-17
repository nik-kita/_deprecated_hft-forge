import { KuWsReqType } from "./ku.ws-req-type.type";
import { KuWsResType } from "./ku.ws-res-type.type";

export type KuWs<
    T extends (KuWsReqType | KuWsResType) = 'message',
    D extends object = Record<never, never>
> = {
    id: string,
    type: T,
} & D;

