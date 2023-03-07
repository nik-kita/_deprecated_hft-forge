import {CurrencyPair, KuWs, Payload} from "@project/types/ku";
import {WebSocket} from 'ws';
import {ISubscriptionManager} from "./subscription-manager.interface";


type SubscriptionState = {
  id: string | null,
  privateSymbols: Set<CurrencyPair>,
  publicSymbols: Set<CurrencyPair>,
};
export class Level2_subscription_manager implements ISubscriptionManager {
  constructor(private ws: WebSocket) {}
  private payloads = new Map<string, Payload<'LEVEL_2'>>();
  private sends = new Map<string, (skipped: boolean) => void>()
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
      this.countNextStateMayBeSendByWs(payload);
    }

    return new Promise((resolve, reject) => {
      this.sends.set(payload.id, (skipped = false) => resolve(skipped));
    });
  }


  /**
   *
   * @deprecated
   *
   * This method is not deprecated, BUT!
   *
   * You should not call it.
   *
   * Why it is not private? Yes it should.
   * This is choice to the typescript compatibility only for developer purposes.
   */
  ack({ id }: KuWs['ACK']['SUB']['PAYLOAD']) {
    const removedPayload = this.payloads.delete(id);

    if (!removedPayload) return false;

    const removedId = this.sortedIds.shift();

    if (removedId !== id) { // TODO write tests and rm this check
      throw new Error();
    }

    const sended = this.sends.get(removedId);

    if (!sended) { // TODO write tests and rm this check
      throw new Error();
    }

    sended(true);

    const nextId = this.sortedIds.shift();

    if (nextId) {
      const payload = this.payloads.get(nextId);

      if (!payload) { // TODO write tests and rm this check
        throw new Error();
      }

      this.countNextStateMayBeSendByWs(payload);
    } else {
      this.state.id = null;
    }

    return true;
  }

  private countNextStateMayBeSendByWs({
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

      const _payload: KuWs['LEVEL_2']['PUB']['PAYLOAD'] = {
        id,
        response: true,
        privateChannel,
        type,
        topic: `/market/level2:${secondPart.join(',')}`,
      };

      this.ws.send(JSON.stringify(_payload));
    } else {
      const index = this.sortedIds.findIndex((_id) => _id === id);

      if (index === -1) throw new Error(); // TODO write tests and rm this check

      const notSended = this.sends.get(id);

      if (!notSended) { // TODO write tests and rm this check
        throw new Error();
      }

      notSended(false);
      void this.sortedIds.splice(index, 1);
      void this.payloads.delete(id);
    }
  }
}
