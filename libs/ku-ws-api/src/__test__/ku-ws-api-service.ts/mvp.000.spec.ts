import { KuWsApiService } from '../..';
import { Level2_SubscriptionManager } from '../../lib/level2.subscription-manager';


describe('KuWsApiService | mvp | 000', () => {
    let kuWsApiService: KuWsApiService;

    beforeEach(() => {
        kuWsApiService = new KuWsApiService({} as any, {} as any);
    });

    it(`Should subscribe to "level2" by returning ${Level2_SubscriptionManager.name}`, () => {
        const l2SubManager = kuWsApiService.subscribe_level2({
            id: `LEVEL_2::${Date.now()}`,
            privateChannel: false,
            topic_second_splitted_by_comma_part: ['1EARTH-USDT'],
        });

        expect(l2SubManager).toBeInstanceOf(Level2_SubscriptionManager);
    });

});
