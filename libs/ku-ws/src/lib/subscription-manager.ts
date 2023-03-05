import {Channel, KuWs} from "@project/types/ku";
import { Payload } from '@project/types/ku';
import {Level2_subscription_manager} from "./level2.subscription-manager";
import {WebSocket} from "ws";

export class SubscriptionManager implements Record<keyof Pick<KuWs, Channel | 'PING_PONG'>, any>{
  private level2: Level2_subscription_manager;
  constructor(private ws: WebSocket) {
    this.level2 = new Level2_subscription_manager(ws);
  }
  LEVEL_2(firstPayload: Omit<
    Payload<'LEVEL_2'>,
    keyof Pick<Payload<'LEVEL_2'>, 'type'>
  >) {
    this.level2.send({
      ...firstPayload,
      type: 'subscribe',
    });
  }
  PING_PONG() {
    // TODO
  }
}
