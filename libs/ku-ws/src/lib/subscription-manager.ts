import {Channel, KuWs} from "@project/types/ku";
import { Payload } from '@project/types/ku';
import {Level2_subscription_manager} from "./level2.subscription-manager";
import {WebSocket} from "ws";
import {MessageHandler} from "./message-handler";

export class SubscriptionManager implements Record<keyof Pick<KuWs, Channel | 'PING_PONG'>, any>{
  private readonly messageHandler: MessageHandler;

  public getMessageHandler() {
    return this.messageHandler;
  }
  private readonly level2: Level2_subscription_manager;
  constructor(private ws: WebSocket) {
    this.level2 = new Level2_subscription_manager(ws);

    const managersByChanel = [this.level2];

    this.messageHandler = new MessageHandler({
      ack(jData: KuWs['ACK']['SUB']['PAYLOAD']) {
        void managersByChanel.some(this.ack(jData));
      },
      pong(jData: KuWs['PING_PONG']['SUB']['PAYLOAD']) {
        // TODO
      },
    });
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
