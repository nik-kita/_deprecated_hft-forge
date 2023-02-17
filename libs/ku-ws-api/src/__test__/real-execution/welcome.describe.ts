import { HttpService } from '@hft-forge/http';
import {
    KuRes_apply_connect_token,
    KuWsResType, KuWsRes_welcome, KU_BASE_URL,
    KU_ENV_KEYS,
    KU_POST_ENDPOINT
} from '@hft-forge/types/ku';
import { itif } from '@hft-forge/utils';
import { WsClientService } from '@hft-forge/ws';
import { afterEach, beforeEach, describe, expect } from '@jest/globals';


export function describe_ku_ws_subscribe_welcome(
    name: 'Should subscribe and receive "welcome" in "type" property of response',
    getData: () => ({
        //
    }),
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
            let wasHere = 'where?';
            const already = 'already';

            const offTimeout = setTimeout(() => {
                expect('not').toBe('here');
            }, 7_000);

            const { body } = await httpClient
                .req(
                    `${KU_BASE_URL}${KU_POST_ENDPOINT.apply_ws_connect_token.public}`,
                    { method: 'POST' },
                );


            expect(body?.json).toBeInstanceOf(Function);

            const jBody = await body.json() as KuRes_apply_connect_token;

            expect(jBody.code).toBe('200000' satisfies KuRes_apply_connect_token['code']);
            expect(jBody.data.token).toMatch(/\S+/);

            const endpoint = jBody.data.instanceServers[0]?.endpoint;
            const token = jBody.data.token;

            expect(endpoint).toMatch(/^wss/);

            await wsClient.connect(endpoint, {
                token,
                id: Date.now(),
            });

            const originWs = wsClient.__getOriginWs();

            originWs.on('message', (data) => {
                wasHere = already;

                const message = JSON.parse(data.toString()) as KuWsRes_welcome;

                expect(message.type).toBe('welcome' satisfies KuWsResType);
                expect(message.id).toBeDefined();
            });

            expect(wsClient.getWsState()).toBe('OPEN');

            await new Promise<void>((resolve) => setTimeout(resolve, 3_000));

            await wsClient.disconnect();

            expect(wsClient.getWsState()).toBe('CLOSED');

            clearTimeout(offTimeout);

            expect(wasHere).toBe(already);
        }, 15_000);

        afterEach(async () => {
            await wsClient?.disconnect();
        });
    });
}

