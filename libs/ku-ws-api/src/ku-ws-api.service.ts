import { HttpService } from '@hft-forge/http';
import { WsClientService } from '@hft-forge/ws';
import { Injectable } from "@nestjs/common";
import { Level2_SubscriptionManager } from './lib/level2.subscription-manager';

@Injectable()
export class KuWsApiService {
    constructor(
        private wsClient: WsClientService,
        private httpClient: HttpService,
    ) { }


    subscribe_level2(options: Pick<
        ConstructorParameters<typeof Level2_SubscriptionManager>[0],
        'privateChannel' | 'topic_second_splitted_by_comma_part' | 'id'
    >) {

        return new Level2_SubscriptionManager({
            ...options,
            response: true,
            topic_first_part: '/market/level2:',
            type: 'subscribe',
        });
    }
}
