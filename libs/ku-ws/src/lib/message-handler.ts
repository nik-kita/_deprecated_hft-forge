import {Channel, KuWs, TechChannel} from "@project/types/ku";

type NoSubjectHandler = Record<KuWs['ACK' | 'PING_PONG']['SUB']['PAYLOAD']['type'], (...args: any[]) => void>;
export class MessageHandler implements Record<KuWs[Channel]['SUB']['PAYLOAD']['subject'], any>{
  private undefined: NoSubjectHandler;

  private handlers = new Map<Channel, ((jData: KuWs[Channel]['SUB']['PAYLOAD']) => void)[]>([
    ['LEVEL_2', []]
  ] satisfies [
    [Channel, ((jData: KuWs['LEVEL_2']['SUB']['PAYLOAD']) => void)[]]
  ]);
  constructor(private noSubjectHandler: NoSubjectHandler) {
    this.undefined = noSubjectHandler;
  }

  public addHandler<T extends Channel>(channel: T, cb: (jData: KuWs[T]['SUB']['PAYLOAD']) => void) {
    this.handlers.get(channel)!.push(cb);

    (cb as any).cleaner = Date.now();

    return (cb as any).cleaner;
  }

  rmHandler(channel: Channel, cleaner: number) {
    const channelHandlers = this.handlers.get(channel)!;

    const index = channelHandlers.findIndex((cb) => (cb as any).cleaner === cleaner);

    if(index !== -1) {
      channelHandlers.splice(index, 1);
    }
  }

  "trade.l2update"(jData: KuWs['LEVEL_2']['SUB']['PAYLOAD']) {
    this.handlers.get('LEVEL_2' satisfies Channel)!.forEach((cb) => void cb(jData));
  }
}
