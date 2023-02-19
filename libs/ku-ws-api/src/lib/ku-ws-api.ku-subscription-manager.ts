import { Coins, KuWsReqSub, KuWsSubscriptionStatus, KuWsTopic } from '@hft-forge/types/ku';


type TopicsInManager = Map<KuWsTopic, { coins: Coins, status: KuWsSubscriptionStatus }>;
export class KuSubscriptionManager {
    private constructor(
        private id: string,
        private topics: TopicsInManager,
    ) { }

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

        return new KuSubscriptionManager(
            id,
            new Map().set(topic, { coins, status: 'pre' }),
        );
    }
}
