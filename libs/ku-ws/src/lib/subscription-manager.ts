import {Channel, KuWs} from "@project/types/ku";

export class SubscriptionManager implements Record<keyof Pick<KuWs, Channel | 'PING_PONG'>, any>{
  LEVEL_2(firstSubscribe: Omit<
    KuWs['LEVEL_2']['PUB']['_PAYLOAD'],
    keyof Pick<KuWs['LEVEL_2']['PUB']['_PAYLOAD'], 'response' | 'type'>
  >) {
    const options: KuWs['LEVEL_2']['PUB']['_PAYLOAD'] = {
      ...firstSubscribe,
      response: true,
      type: 'subscribe',
    };
  }
  PING_PONG() {
    // TODO
  }
}
