import { HttpService } from '@hft-forge/http';
import {
    KuRes_apply_connect_token,
    KuWsConnectPayload, KuWsReq_ping, KuWsResType, KuWsRes_welcome, KU_BASE_URL, KU_ENV_KEYS,
    KU_POST_ENDPOINT
} from '@hft-forge/types/ku';
import { itif } from '@hft-forge/test-pal/core';
import { WsClientService } from '@hft-forge/ws';
import { afterEach, beforeEach, describe, expect } from '@jest/globals';


export function describe_ku_ws_subscribe_ping_pong(
    name: 'Should subscribe: ping <=> pong',
) {

    return describe(name, () => {
        let wsClient: WsClientService;
        let httpClient: HttpService;


        beforeEach(async () => {
            wsClient = new WsClientService();
            httpClient = new HttpService();
        });

        itif({
            needEnv: { envFilePath: '.test.env', envVariables: KU_ENV_KEYS.map((k) => k) },
        })('Should subscribe and receive "welcome" message', async () => {
            const offTimeout = setTimeout(() => {
                expect('not').toBe('here');
            }, 7_000);
            const { body } = await httpClient
                .req(
                    `${KU_BASE_URL}${KU_POST_ENDPOINT.apply_ws_connect_token.public}`,
                    { method: 'POST' },
                );
            const jBody = await body.json() as KuRes_apply_connect_token;
            const { token, instanceServers: [{ endpoint }] } = jBody.data;
            const connectPayload: KuWsConnectPayload = {
                id: Date.now(),
                token,
            };

            await wsClient.connect(endpoint, connectPayload);

            const originWs = wsClient.__getOriginWs();
            
            await new Promise<void>((resolve) => {
                let messageCounter = 0;

                originWs.on('message', (data) => {
                    const message = JSON.parse(data.toString()) as KuWsRes_welcome;

                    if (messageCounter === 0) {
                        expect(message.type).toBe('welcome' satisfies KuWsResType);

                        const pingPayload: KuWsReq_ping = {
                            id: message.id,
                            type: 'ping',
                        };

                        originWs.send(JSON.stringify(pingPayload));
                    } else if (messageCounter === 1) {
                        expect(message.type).toBe('pong' satisfies KuWsResType);

                        resolve();
                    }

                    ++messageCounter;
                });
            });

            await wsClient.disconnect();

            clearTimeout(offTimeout);
        }, 15_000);

        afterEach(async () => {
            await wsClient?.disconnect();
        });
    });
}

