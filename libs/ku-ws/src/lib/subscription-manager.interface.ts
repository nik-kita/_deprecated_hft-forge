import {KuWs} from "@project/types/ku";

export interface ISubscriptionManager {
  ack(jData: KuWs['ACK']['SUB']['PAYLOAD']): boolean,
}
