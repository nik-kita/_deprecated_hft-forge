import { Coins, KuWsReqSub, KuWsSubscriptionStatus, KuWsTopic } from '@hft-forge/types/ku';



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

        return new KuSubscriptionManager(id, new Map<KuWsTopic, {
            coins: Coins,
            status: KuWsSubscriptionStatus,
        }>().set(topic, { coins, status: 'pre' }));
    }

    private constructor(
        private id: string,
        private topics: Map<KuWsTopic, { coins: Coins, status: KuWsSubscriptionStatus }>,
    ) { }
}
