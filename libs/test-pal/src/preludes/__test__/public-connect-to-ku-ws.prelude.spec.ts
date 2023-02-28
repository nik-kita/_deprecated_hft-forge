import { WebSocket } from 'ws';
import { publicConnectToKuWs } from '..';
import { KU_ENV_KEYS } from '@hft-forge/types/ku/common';
import { itif } from '../../core';

describe(publicConnectToKuWs.name, () => {
    itif({
        needEnv: {
            envFilePath: '.test.env',
            envVariables: KU_ENV_KEYS,
        }
    })('Should return token and endpoint', async () => {
        const connectedWs = await publicConnectToKuWs();

        expect(connectedWs.readyState).toBe(WebSocket.OPEN);

        connectedWs.close();
    });
});
