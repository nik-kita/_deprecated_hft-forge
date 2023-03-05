import {CurrencyPair, KuWs, Payload} from "@project/types/ku";
import {WebSocket} from 'ws';
import {isSymbol} from "@nestjs/common/utils/shared.utils";

type SubscriptionState = {
  id: string | null,
  privateSymbols: Set<CurrencyPair>,
  publicSymbols: Set<CurrencyPair>,
};
export class Level2_subscription_manager {
  constructor(private ws: WebSocket) {}
  private payloads = new Map<string, Payload<'LEVEL_2'>>();
  private sortedIds = [] as string[];

  private state: SubscriptionState = {
    id: null,
    publicSymbols: new Set(),
    privateSymbols: new Set(),
  };
  send(payload: Payload<'LEVEL_2'>) {
    this.payloads.set(payload.id, payload);
    this.sortedIds.push(payload.id);

    if (this.state.id === null) {
      this.sendByWs(payload, this.countNextState(payload));
    }

  }

  ack({ id }: KuWs['ACK']['SUB']['PAYLOAD']) {
    const removed = this.payloads.delete(id);
    void this.sortedIds.shift();

    if (!removed) {
      throw new Error('this.payloads should always contain pair for ack.id');
    }

    const nextId = this.sortedIds.shift();

    if (nextId) {
      const payload = this.payloads.get(nextId);

      if (!payload) {
        throw new Error('this.payloads should contain pair for nextId until it exists');
      }

      this.sendByWs(payload, this.countNextState(payload));
    } else {
      this.state.id = null;
    }
  }

  private countNextState({
                           id,
                           privateChannel,
                           type,
                           topic_second_splitted_by_comma_part,
                         }: Payload<'LEVEL_2'>) {
    const nextState = structuredClone(this.state);
    let secondPart: CurrencyPair[];

    if (type === 'subscribe') {
      if (privateChannel) {
        topic_second_splitted_by_comma_part.forEach((symbol) => void nextState.privateSymbols.add(symbol));
        secondPart = [...nextState.privateSymbols].filter((symbol) => !this.state.privateSymbols.has(symbol));
      } else {
        topic_second_splitted_by_comma_part.forEach((symbol) => {
          nextState.privateSymbols.add(symbol);
          nextState.publicSymbols.add(symbol);
        });
        secondPart = [
          ...[...nextState.privateSymbols].filter((symbol) => !this.state.privateSymbols.has(symbol)),
          ...[...nextState.publicSymbols].filter((symbol) => !this.state.publicSymbols.has(symbol)),
        ];
      }
    } else {
      if (privateChannel) {
        topic_second_splitted_by_comma_part.forEach((symbol) => void nextState.privateSymbols.delete(symbol));
        secondPart = [...this.state.privateSymbols].filter((symbol) => !nextState.privateSymbols.has(symbol));
      } else {
        topic_second_splitted_by_comma_part.forEach((symbol) => {
          nextState.privateSymbols.delete(symbol);
          nextState.publicSymbols.delete(symbol);
        });
        secondPart = [
          ...[...this.state.privateSymbols].filter((symbol) => !nextState.privateSymbols.has(symbol)),
          ...[...this.state.publicSymbols].filter((symbol) => !nextState.publicSymbols.has(symbol)),
        ];
      }
    }

    if (secondPart.length) {
      nextState.id = id;
      this.state = nextState;
    } else {
      const index = this.sortedIds.findIndex((_id) => _id === id);

      if (index === -1) throw new Error('this.sortedIds should contain this id');

      void this.sortedIds.splice(index, 1);
    }

    return secondPart;
  }

  private sendByWs({
                     id,
                     privateChannel,
                     type,
                   }: Omit<Payload<'LEVEL_2'>, keyof Pick<Payload<'LEVEL_2'>, 'topic_second_splitted_by_comma_part'>>,
                   symbols: CurrencyPair[]) {
    if (!symbols.length) return;

    const _payload: KuWs['LEVEL_2']['PUB']['PAYLOAD'] = {
      id,
      response: true,
      privateChannel,
      type,
      topic: `/market/level2:${symbols.join(',')}`,
    };

    this.ws.send(JSON.stringify(_payload));
  }
}
