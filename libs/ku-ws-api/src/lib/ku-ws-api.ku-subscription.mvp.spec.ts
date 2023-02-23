import { KuSubscriptionManager } from './ku-ws-api.ku-subscription-manager';



describe(KuSubscriptionManager.name, () => {
    it('Should not get manager', () => {
        const manager = KuSubscriptionManager.getById('LEVEL_2::1');

        expect(manager).toBeUndefined();
    });

    it('Should create and get manager', () => {
        const id = `LEVEL_2::${Date.now()}` as const;

        KuSubscriptionManager.init({
            id, 
            channel: 'LEVEL_2',
            privateChannel: false,
            response: true,
            topic_first_part: '/market/level2:',
            topic_second_splitted_by_comma_part: ['1EARTH-USDT'],
            type: 'subscribe',
        });

        const manager = KuSubscriptionManager.getById(id);

        expect(manager).toBeDefined();
    });
});
