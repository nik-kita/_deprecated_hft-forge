import { Level2_SubscriptionManager } from '../../lib/level2.subscription-manager';



describe(`${Level2_SubscriptionManager.name} | mvp | 000`, () => {
    const id = `LEVEL_2::${Date.now()}` as const;
    let l2Manager: Level2_SubscriptionManager;

    beforeEach(() => {
        l2Manager = new Level2_SubscriptionManager({
            id,
            privateChannel: false,
            response: true,
            topic_first_part: '/market/level2:',
            topic_second_splitted_by_comma_part: ['USDT-BTC'],
            type: 'subscribe',
        });
    });
    it('Should subscribe', () => {
        expect(l2Manager.getState().state.privateTopics.has('USDT-BTC')).toBe(true);
    });

    it('Should unsubscribe', () => {
        l2Manager.update({
            id,
            privateChannel: false,
            type: 'unsubscribe',
            response: true,
            topic_first_part: '/market/level2:',
            topic_second_splitted_by_comma_part: ['USDT-BTC'],
        });
        l2Manager.onAck();
        expect(l2Manager.getState().state.privateTopics.has('USDT-BTC')).toBe(false);
    });
    it('Should unsubscribe only from "private"', () => {
        l2Manager.update({
            id,
            privateChannel: true,
            type: 'unsubscribe',
            response: true,
            topic_first_part: '/market/level2:',
            topic_second_splitted_by_comma_part: ['USDT-BTC'],
        });
        l2Manager.onAck();
        expect(l2Manager.getState().state.privateTopics.has('USDT-BTC')).toBe(false);
        expect(l2Manager.getState().state.publicTopics.has('USDT-BTC')).toBe(true);
    });
    it('Should subscribe to "private" only', () => {
        l2Manager.update({
            id,
            privateChannel: true,
            type: 'subscribe',
            response: true,
            topic_first_part: '/market/level2:',
            topic_second_splitted_by_comma_part: ['USDT-1EARTH'],
        });
        l2Manager.onAck();
        expect(l2Manager.getState().state.privateTopics.has('USDT-1EARTH')).toBe(true);
        expect(l2Manager.getState().state.publicTopics.has('USDT-1EARTH')).toBe(false);
    });  
});
