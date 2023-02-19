import { KuSubscriptionManager } from './ku-ws-api.ku-subscription-manager';



describe(KuSubscriptionManager.name, () => {
    it('Should correctly create subscription', () => {
        const id = 'hello';
        const sub = KuSubscriptionManager.init({
            id, 
            response: true,
            topic: '/market/level2',
            type: 'subscribe',
            coins: ['USDT-BTC'],
        });

        expect((sub as any)?.topics?.get('/market/level2')?.[0]).toBe('USDT-BTC');
    });
});
