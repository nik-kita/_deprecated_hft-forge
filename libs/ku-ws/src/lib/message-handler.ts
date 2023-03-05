import {Channel, KuWs, TechChannel} from "@project/types/ku";

type NoSubjectHandler = (...args: any[]) => void;
export class MessageHandler implements Record<KuWs[Channel]['SUB']['PAYLOAD']['subject'], any>{
  private undefined: NoSubjectHandler;

  private handlers = new Map<Channel, ((jData: KuWs[Channel]['SUB']['PAYLOAD']) => void)[]>([
    ['LEVEL_2', []]
  ] satisfies [
    [Channel, ((jData: KuWs['LEVEL_2']['SUB']['PAYLOAD']) => void)[]]
  ]);

  /**
   * @deprecated
   *
   * It is not deprecated, BUT!
   * You should get instance of it only from SubscriptionManager.getMessageHandler()
   */
  constructor(private noSubjectHandler: NoSubjectHandler) {
    this.undefined = noSubjectHandler;
  }

  public addHandler<T extends Channel>(channel: T, cb: (jData: KuWs[T]['SUB']['PAYLOAD']) => void) {
    this.handlers.get(channel)!.push(cb);

    (cb as any).cleaner = Date.now();

    return (cb as any).cleaner;
  }

  public rmHandler(channel: Channel, cleaner: number) {
    const channelHandlers = this.handlers.get(channel)!;

    const index = channelHandlers.findIndex((cb) => (cb as any).cleaner === cleaner);

    if(index !== -1) {
      channelHandlers.splice(index, 1);
    }
  }

  /**
   * @deprecated
   *
   * It is not deprecated, BUT!
   * You should not directly call this method!
   * But dynamically, from message.subject - OK.
   */
  "trade.l2update"(jData: KuWs['LEVEL_2']['SUB']['PAYLOAD']) {
    this.handlers.get('LEVEL_2' satisfies Channel)!.forEach((cb) => void cb(jData));
  }
}
