import { KuReqService } from '@hft-forge/ku-http-api';
import { KuSub } from '@hft-forge/types/ku/ws';
import { WsClientService } from '@hft-forge/ws';
import { Injectable } from "@nestjs/common";
import { Level2_SubscriptionManager } from './lib/level2.subscription-manager';

@Injectable()
export class KuWsApiService {
    constructor(
        private wsClient: WsClientService,
        private kuReq: KuReqService,
    ) { }

    private subscriptions = new Map<KuSub['PAYLOAD']['subject'], Map<string, Level2_SubscriptionManager>>([
        ['trade.l2update', new Map()], // TODO add all managers
        // TODO create common type (may be union) to indicate all managers
    ] satisfies [KuSub['PAYLOAD']['subject'], Map<string, Level2_SubscriptionManager>][]);

    subscribe_level2(options: Pick<
        ConstructorParameters<typeof Level2_SubscriptionManager>[0],
        'privateChannel' | 'topic_second_splitted_by_comma_part' | 'id'
    >) {
        const manager = new Level2_SubscriptionManager({
            ...options,
            response: true,
            topic_first_part: '/market/level2:',
            type: 'subscribe',
        });

        this.subscriptions.get('trade.l2update')!.set(options.id, manager);
    }
}
