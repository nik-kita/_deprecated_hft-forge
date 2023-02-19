import { KuWsResAcc } from "./ku.ack.res.type";
import { KuWsRes_level2 } from "./ku.level2.type";
import { KuWsRes_pong } from "./ku.ping-pong.type";
import { KuWsRes_welcome } from "./ku.welcome.res.type";

export type KuWsRes = KuWsRes_welcome
    | KuWsResAcc
    | KuWsRes_pong
    | KuWsRes_level2
    ;
