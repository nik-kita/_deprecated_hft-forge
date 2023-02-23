import { KuSubscriptionManager } from './ku-ws-api.ku-subscription-manager';



describe(KuSubscriptionManager.name, () => {
    const id = `LEVEL_2::${Date.now()}` as const;
    it('Should not get manager', () => {
        const manager = KuSubscriptionManager.getById('LEVEL_2::1');

        expect(manager).toBeUndefined();
    });

    it('Should create and get manager', () => {

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

    it ('Manager should have correct values', () => {
        const manager = KuSubscriptionManager.getById(id) as any;

        expect(manager.id).toBe(id);
        expect(manager.topic).toBeDefined();
        expect(manager.topic.length).toBe(1);
        expect(manager.topic[0]).toBe('1EARTH-USDT');
        expect(manager.isTopicIncluded).toBe(true);
        expect(manager.status).toBe('pending');
        expect(manager.privacyStatus).toBe(false);
    });
});
