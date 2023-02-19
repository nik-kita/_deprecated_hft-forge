import { itif } from '@hft-forge/test-pal/core';
import { privateConnectToKuWs, publicConnectToKuWs } from '@hft-forge/test-pal/preludes';
import {
    KuWsResType, KuWsRes_welcome, KU_ENV_KEYS
} from '@hft-forge/types/ku';


describe('Check first message "welcome" after connection', () => {
    itif({
        needEnv: { envFilePath: '.test.env', envVariables: KU_ENV_KEYS.map((k) => k) },
    })('Should receive with public connection', async () => {
        const originWs = await publicConnectToKuWs();

        await new Promise<void>((resolve) => {
            originWs.on('message', (data) => {
                const message = JSON.parse(data.toString()) as KuWsRes_welcome;

                expect(message.type).toBe('welcome' satisfies KuWsResType);
                expect(message.id).toBeDefined();

                resolve();
            });
        });

        originWs.close();
    }, 10_000);

    itif({
        needEnv: { envFilePath: '.test.env', envVariables: KU_ENV_KEYS.map((k) => k) },
    })('Should receive with private connection', async () => {
        const originWs = await privateConnectToKuWs();

        await new Promise<void>((resolve) => {
            originWs.on('message', (data) => {
                const message = JSON.parse(data.toString()) as KuWsRes_welcome;

                expect(message.type).toBe('welcome' satisfies KuWsResType);
                expect(message.id).toBeDefined();

                resolve();
            });
        });

        originWs.close();
    }, 10_000);
});


