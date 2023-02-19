import { HttpService } from '@hft-forge/http';
import { KuSignGeneratorService } from '@hft-forge/ku-http-api';
import { itif } from '@hft-forge/test-pal/core';
import { KuReq_apply_private_connect_token, KuRes_apply_connect_token, KuWs, KuWsReq_level2, KuWsReq_level2_unsubscribe, KuWsResType, KU_BASE_URL, KU_ENV_KEYS } from '@hft-forge/types/ku';
import { qsFromObj } from '@hft-forge/utils';
import { WebSocket } from 'ws';

describe('Subscription compute messaging state by counting distinct received messages types', () => {
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
        },
    })('Should unsubscribe with "private=true"', (done) => {
        (async () => {
            const applyConnect: KuReq_apply_private_connect_token = {
                endpoint: '/api/v1/bullet-private',
                method: 'POST',
            };
            const headers = signGenerator.generateHeaders(applyConnect, process.env as any);
            const { body } = await http.req(`${KU_BASE_URL}${applyConnect.endpoint}`, {
                method: applyConnect.method,
                headers,
            });
            const { data: { token, instanceServers: [{ endpoint }] } } = await body.json() as KuRes_apply_connect_token;
            const id = Date.now().toString();
            const ws = new WebSocket(endpoint + '?' + qsFromObj({ token, id }));
            const messages: any[] = [];
            const receivedTypes = new Set<string>();
            const messagingState = {
                1: 'welcome',
                2: 'start-messaging',
                3: 'messaging',
            } as const;


            ws.on('message', (data) => {
                const message = JSON.parse(data.toString()) as KuWs;

                receivedTypes.add(message.type);
                message.type !== 'message' && messages.push(message);


                if (message.type === 'welcome') {
                    expect(messagingState[receivedTypes.size]).toBe('welcome');
                    const level2: KuWsReq_level2 = {
                        id, response: true, topic: '/market/level2:USDT-BTC', type: 'subscribe',
                    };

                    ws.send(JSON.stringify(level2));

                    return;
                } else if (message.type === 'ack' && messages.filter(({ type }) => {

                    return type === 'ack';
                }).length === 1) {
                    expect(messagingState[receivedTypes.size]).toBe('start-messaging');
                    const level2_unsubscribe: KuWsReq_level2_unsubscribe = {
                        id,
                        privateChannel: true,
                        response: true,
                        topic: '/market/level2:USDT-BTC',
                        type: 'unsubscribe',
                    };

                    ws.send(JSON.stringify(level2_unsubscribe));

                    return;
                } else if (message.type === 'ack' && messages.filter(({ type }) => {

                    return type === 'ack';
                }).length === 2) {
                    // unsubscribed
                    ws.once('close', (err) => {
                        err && console.warn(err);

                        done();
                    });

                    ws.close();

                    return;
                }
            });
        })();
    }, 15_000);


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


    itif({
        needEnv: {
            envFilePath: '.test.env',
            envVariables: KU_ENV_KEYS.map((k) => k),
        }
    })('Should unsubscribe from level2', (done) => {
        (async () => {
            const applyConnectTokenReqPayload: KuReq_apply_private_connect_token = {
                endpoint: '/api/v1/bullet-private',
                method: 'POST',
            };
            const headers = signGenerator.generateHeaders(applyConnectTokenReqPayload, process.env as any);
            const { data: { token, instanceServers: [{ endpoint }] } } = await http.req(`${KU_BASE_URL}${applyConnectTokenReqPayload.endpoint}`, {
                headers,
                method: applyConnectTokenReqPayload.method,
            }).then(({ body }) => body.json());
            const id = Date.now().toString();
            const ws = new WebSocket(endpoint + '?' + qsFromObj({
                token,
                id,
            }));
            const level2_subscription: KuWsReq_level2 = {
                id,
                response: true,
                type: 'subscribe',
                topic: '/market/level2:BTC-USDT',
            };
            const level2_unsubscribe: KuWsReq_level2_unsubscribe = {
                ...level2_subscription,
                type: 'unsubscribe',
                privateChannel: false,
            };
            const expects: {
                type: KuWsResType,
            }[] = [
                    { type: 'message' },
                    { type: 'ack' },
                    { type: 'welcome' },
                ];

            let startUnsubscribing = false;
            let lastMessage = false;

            ws.on('message', (data) => {
                const expected = expects.pop();
                const message = JSON.parse(data.toString()) as any;

                lastMessage && expect('this message').toBe('is next after last');

                if (expected?.type === 'welcome') {
                    ws.send(JSON.stringify(level2_subscription));
                }

                if (message.type === 'ack' && startUnsubscribing) {
                    lastMessage = true;

                    ws.once('close', (err) => {
                        err && console.warn(err);

                        done();
                    });
                    ws.close();
                }

                if (!expects.length && !startUnsubscribing) {
                    startUnsubscribing = true;

                    ws.send(JSON.stringify(level2_unsubscribe));
                } else if (expects.length) {
                    expect(message.type).toBe(expected?.type);
                }
            });
        })();
    }, 15_000);
});

