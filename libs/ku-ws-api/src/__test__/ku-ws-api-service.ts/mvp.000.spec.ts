import { KuWsApiService } from '../..';
import { Level2_SubscriptionManager } from '../../lib/level2.subscription-manager';


describe('KuWsApiService | mvp | 000', () => {
    let kuWsApiService: KuWsApiService;

    beforeEach(() => {
        kuWsApiService = new KuWsApiService({} as any, {} as any);
    });

    it(`Should subscribe to "level2" by returning ${Level2_SubscriptionManager.name}`, () => {
        const id = `LEVEL_2::${Date.now()}` as const;

        kuWsApiService.subscribe_level2({
            id,
            privateChannel: false,
            topic_second_splitted_by_comma_part: ['1EARTH-USDT'],
        });

        const l2SubManager = (kuWsApiService as any).subscriptions.get('trade.l2update').get(id);

        expect(l2SubManager).toBeInstanceOf(Level2_SubscriptionManager);
    });

});
