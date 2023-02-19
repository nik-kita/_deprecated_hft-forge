import { itif } from '@hft-forge/test-pal/core';
import { privateConnectToKuWs, publicConnectToKuWs } from '@hft-forge/test-pal/preludes';
import { KuWsReq_ping, KuWsResType, KuWsRes_welcome, KU_ENV_KEYS } from '@hft-forge/types/ku';


describe('Check "ping <=> pong" messaging after subscribing', () => {
    itif({
        needEnv: { envFilePath: '.test.env', envVariables: KU_ENV_KEYS.map((k) => k) },
    })('With public connection', async () => {
        const originWs = await publicConnectToKuWs();

        await new Promise<void>((resolve, reject) => {
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
                } else {
                    reject(`Unexpected message type ${message.type}`);
                }

                ++messageCounter;
            });
        });

        originWs.close();

    }, 10_000);

    itif({
        needEnv: { envFilePath: '.test.env', envVariables: KU_ENV_KEYS.map((k) => k) },
    })('With private connection', async () => {
        const originWs = await privateConnectToKuWs();

        await new Promise<void>((resolve, reject) => {
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
                } else {
                    reject(`Unexpected message type ${message.type}`);
                }

                ++messageCounter;
            });
        });

        originWs.close();

    }, 10_000);
});

