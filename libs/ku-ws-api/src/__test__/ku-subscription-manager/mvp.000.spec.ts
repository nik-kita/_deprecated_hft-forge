import { CurrencyPair } from '@hft-forge/types/ku/common';
import { PrivacyStatus, SubscriptionStatus } from '@hft-forge/types/ku/ws';
import { HftForgeError } from '@hft-forge/utils';
import { KuSubscriptionManager } from '../../lib/ku-ws-api.ku-subscription-manager';



describe(`${KuSubscriptionManager.name} | mvp | 000`, () => {
    const id = `LEVEL_2::${Date.now()}` as const;
    const currency: CurrencyPair = '1EARTH-USDT';
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
        expect(manager.topic[0]).toBe(currency);
        expect(manager.isTopicIncluded).toBe(true);
        expect(manager.status).toBe('pending');
        expect(manager.privacyStatus).toBe('private-public' satisfies PrivacyStatus);
    });

    it('Should update "status" to "active"', () => {
        const manager = KuSubscriptionManager.getById(id) as any;
        
        manager.updateByAck();
        
        expect(manager.status).toBe('active' satisfies SubscriptionStatus);
    });
    
    it('Should throw error because "ack" happen without client request', () => {
        const manager = KuSubscriptionManager.getById(id) as any;
        
        expect(() => manager.updateByAck()).toThrowError(HftForgeError);
    });
    
    it ('Should unsubscribe and set correct values', () => {
        const manager = KuSubscriptionManager.getById(id);

        manager?.updateByClient({
            id,
            channel: 'LEVEL_2',
            privateChannel: true,
            type: 'unsubscribe',
            response: true,
            topic_first_part: '/market/level2:',
            topic_second_splitted_by_comma_part: [currency],
        });

        const _manager = manager as any;

        expect(_manager.status).toBe('changing');
        expect(_manager.privacyStatus).toBe('public-only');
        expect(_manager.topic.length).toBe(0);
    });
});
