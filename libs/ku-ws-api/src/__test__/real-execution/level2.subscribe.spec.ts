import { itif } from '@hft-forge/test-pal/core';
import { privateConnectToKuWs } from '@hft-forge/test-pal/preludes';
import { KU_ENV_KEYS } from '@hft-forge/types/ku/common';
import { AnyChannel, KuPub, KuSub } from '@hft-forge/types/ku/ws';
import { WebSocket } from 'ws';



type _MessageType = KuSub<AnyChannel>['payload']['type'];


describe('Level2 Kucoin subscription', () => {
    let ws: WebSocket;

    beforeEach(async () => {
        ws = await privateConnectToKuWs();
    });

    afterEach(() => {
        if (ws?.readyState === WebSocket.OPEN) {
            ws.close();
        }
    });

    itif({
        needEnv: {
            envFilePath: '.test.env',
            envVariables: KU_ENV_KEYS,
        },
    })('Should unsubscribe with "private=true"', (done) => {
        const id = Date.now().toString();
        const messages: any[] = [];
        const receivedTypes = new Set<string>();
        const messagingState = {
            1: 'welcome',
            2: 'start-messaging',
            3: 'messaging',
        } as const;


        ws.on('message', (data) => {
            const message = JSON.parse(data.toString()) as KuSub<AnyChannel>['payload'];

            receivedTypes.add(message.type);
            message.type !== 'message' && messages.push(message);

            if (message.type === 'welcome') {
                expect(messagingState[receivedTypes.size]).toBe('welcome');

                const level2: KuPub<'LEVEL_2'>['payload'] = {
                    id,
                    response: true,
                    topic: '/market/level2:BTC-USDT',
                    type: 'subscribe',
                    privateChannel: false,
                };

                ws.send(JSON.stringify(level2));

                return;
            } else if (message.type === 'ack' && messages.filter(({ type }) => {

                return type === 'ack';
            }).length === 1) {
                expect(messagingState[receivedTypes.size]).toBe('start-messaging');
                const level2_unsubscribe: KuPub<'LEVEL_2'>['payload'] = {
                    id,
                    privateChannel: true,
                    response: true,
                    topic: '/market/level2:BTC-USDT',
                    type: 'unsubscribe',
                };

                ws.send(JSON.stringify(level2_unsubscribe));

                return;
            } else if (message.type === 'ack' && messages.filter(({ type }) => {

                return type === 'ack';
            }).length === 2) {
                ws.once('close', (err) => {
                    err && console.warn(err);

                    done();
                });

                ws.close();

                return;
            }
        });
    }, 15_000);


    itif({
        needEnv: {
            envFilePath: '.test.env',
            envVariables: KU_ENV_KEYS,
        }
    })('Should receive "ack" message after subscription', (done) => {
        const expects: {
            type: _MessageType,
        }[] = [
                { type: 'message' },
                { type: 'ack' },
                { type: 'welcome' },
            ];
        const id = Date.now().toString();
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
                const level2_subscription: KuPub<'LEVEL_2'>['payload'] = {
                    id,
                    response: true,
                    type: 'subscribe',
                    topic: '/market/level2:BTC-USDT',
                    privateChannel: false,
                };

                ws.send(JSON.stringify(level2_subscription));
            }
        });
    }, 10_000);


    itif({
        needEnv: {
            envFilePath: '.test.env',
            envVariables: KU_ENV_KEYS,
        }
    })('Should unsubscribe from level2', (done) => {
        const id = Date.now().toString();
        const level2_subscription: KuPub<'LEVEL_2'>['payload'] = {
            id,
            response: true,
            type: 'subscribe',
            topic: '/market/level2:BTC-USDT',
            privateChannel: false,
        };
        const level2_unsubscribe: KuPub<'LEVEL_2'>['payload'] = {
            ...level2_subscription,
            type: 'unsubscribe',
            privateChannel: false,
        };
        const expects: {
            type: any,
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
            } else if (message.type === 'ack' && startUnsubscribing) {
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
    }, 10_000);
});

