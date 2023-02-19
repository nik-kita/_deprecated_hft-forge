import { Coins } from '@hft-forge/types/common';
import { KuWsReqSub, KuWsTopic } from '@hft-forge/types/ku';



export class KuSubscriptionManager {
    public static init(subscriptionRequest: Omit<
        KuWsReqSub,
        'response'
        | 'topic'
    > & {
        response: true,
        topic: KuWsTopic,
        coins: Coins,
    }) {

        const { id, topic, coins } = subscriptionRequest;

        return new KuSubscriptionManager(id, new Map<KuWsTopic, Coins>().set(topic, coins));
    }

    private constructor(private id: string, private topics: Map<KuWsTopic, Coins>) { }
}
