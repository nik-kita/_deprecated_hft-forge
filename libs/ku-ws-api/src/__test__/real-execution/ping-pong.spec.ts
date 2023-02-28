import { itif } from '@hft-forge/test-pal/core';
import { privateConnectToKuWs, publicConnectToKuWs } from '@hft-forge/test-pal/preludes';
import { KU_ENV_KEYS } from '@hft-forge/types/ku/common';
import { AnyChannel, KuPub, KuSub } from '@hft-forge/types/ku/ws';


describe('Check "ping <=> pong" messaging after subscribing', () => {
    itif({
        needEnv: { envFilePath: '.test.env', envVariables: KU_ENV_KEYS },
    })('With public connection', async () => {
        const originWs = await publicConnectToKuWs();

        await new Promise<void>((resolve, reject) => {
            let messageCounter = 0;
            const id = Date.now().toString();

            originWs.on('message', (data) => {
                const message = JSON.parse(data.toString()) as KuSub<AnyChannel>['payload'];

                if (messageCounter === 0) {
                    expect(message.type).toBe('welcome');

                    const pingPayload: KuPub<'PING_PONG'>['payload'] = {
                        id,
                        type: 'ping',
                    };

                    originWs.send(JSON.stringify(pingPayload));
                } else if (messageCounter === 1) {
                    expect(message.type).toBe('pong' satisfies KuSub<AnyChannel>['payload']['type']);

                    resolve();
                } else {
                    reject(`Unexpected message type ${message.type}`);
                }

                ++messageCounter;
            });
        });

        originWs.close();

    }, 10_000);

    itif({
        needEnv: { envFilePath: '.test.env', envVariables: KU_ENV_KEYS },
    })('With private connection', async () => {
        const originWs = await privateConnectToKuWs();

        await new Promise<void>((resolve, reject) => {
            let messageCounter = 0;
            const id = Date.now().toString();

            originWs.on('message', (data) => {
                const message = JSON.parse(data.toString()) as KuSub<'WELCOME'>['payload'];

                if (messageCounter === 0) {
                    expect(message.type).toBe('welcome' satisfies KuSub<AnyChannel>['payload']['type']);

                    const pingPayload: KuPub<'PING_PONG'>['payload'] = {
                        id,
                        type: 'ping',
                    };

                    originWs.send(JSON.stringify(pingPayload));
                } else if (messageCounter === 1) {
                    expect(message.type).toBe('pong' satisfies KuSub<AnyChannel>['payload']['type']);

                    resolve();
                } else {
                    reject(`Unexpected message type ${message.type}`);
                }

                ++messageCounter;
            });
        });

        originWs.close();

    }, 10_000);
});

