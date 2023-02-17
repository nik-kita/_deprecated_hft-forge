import { HttpService } from '@hft-forge/http';
import { KuSignGeneratorService } from '@hft-forge/ku-http-api';
import { KuReq_apply_private_connect_token, KuRes_apply_connect_token, KuWsReq_level2, KuWsResType, KU_BASE_URL, KU_ENV_KEYS } from '@hft-forge/types/ku';
import { itif, qsFromObj } from '@hft-forge/utils';
import { beforeEach, describe, expect } from '@jest/globals';
import { WebSocket } from 'ws';

export function describe_subscribe_level2(
    name: 'Subscription to level2',
) {
    return describe(name, () => {
        let http: HttpService;
        let signGenerator: KuSignGeneratorService;


        beforeEach(() => {
            http = new HttpService();
            signGenerator = new KuSignGeneratorService();
        });


        itif({
            needEnv: {
                envFilePath: '.test.env',
                envVariables: KU_ENV_KEYS.map((k) => k),
            }
        })('Should receive "ack" message after subscription', (done) => {
            const applyConnectTokenReqPayload: KuReq_apply_private_connect_token = {
                endpoint: '/api/v1/bullet-private',
                method: 'POST',
            };
            const headers = signGenerator.generateHeaders(applyConnectTokenReqPayload, process.env as any);

            http.req(`${KU_BASE_URL}${applyConnectTokenReqPayload.endpoint}`, {
                headers,
                method: applyConnectTokenReqPayload.method,
            }).then(({ body }) => {

                return body.json() as Promise<KuRes_apply_connect_token>;
            }).then(({ data: { token, instanceServers: [{ endpoint }] } }) => {

                const id = Date.now().toString();
                const ws = new WebSocket(endpoint + '?' + qsFromObj({
                    token,
                    id,
                }));

                const expects: {
                    type: KuWsResType,
                }[] = [
                        { type: 'message' },
                        { type: 'ack' },
                        { type: 'welcome' },
                    ];

                let completed = false;

                ws.on('message', (data) => {
                    const expected = expects.pop();

                    if (!expects.length && !completed) {
                        completed = true;

                        ws.on('close', (err) => {
                            err && console.warn(err);

                            done();
                        });
                        ws.terminate(); // TODO why "close" don't close?
                    } else {
                        const message = JSON.parse(data.toString()) as any;

                        expect(message.type).toBe(expected?.type);
                    }

                    if (expected?.type === 'welcome') {
                        const level2_subscription: KuWsReq_level2 = {
                            id,
                            response: true,
                            type: 'subscribe',
                            topic: '/market/level2:BTC-USDT',
                        };

                        ws.send(JSON.stringify(level2_subscription));
                    }
                });
            });
        }, 15_000);
    });
}
