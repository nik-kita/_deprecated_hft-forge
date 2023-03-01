import { KuSub } from '@hft-forge/types/ku/ws';
import { HftForgeError } from '@hft-forge/utils';
import { WsClientService } from '@hft-forge/ws';
import { Level2_SubscriptionManager } from "./level2.subscription-manager";

const l2_subject = 'trade.l2update' satisfies KuSub['PAYLOAD']['subject'];

export class ConnectionManager {
    subscriptions = new Map([
        [l2_subject, new Map<string, Level2_SubscriptionManager>()]
    ]);

    private constructor(private wsClient: WsClientService) { }

    public static async init(wsClient: WsClientService, { endpoint, ...credentials }: {
        endpoint: string, token: string, id: string,
    }) {
        await wsClient.connect(endpoint, credentials);

        const ws = wsClient.__getOriginWs();

        await new Promise<void>((resolve, reject) => {
            ws.once('message', (data) => {
                const jData = JSON.parse(data.toString());
                console.log(jData);

                if (jData.type === 'welcome') {
                    resolve();
                } else {
                    reject(new HftForgeError('Unexpected message type', {
                        actual: jData,
                        expected: 'First message after connection should have "type" prop with "welcome" value',
                    }));
                }
            });
        });

        return new ConnectionManager(wsClient);
    }
}
