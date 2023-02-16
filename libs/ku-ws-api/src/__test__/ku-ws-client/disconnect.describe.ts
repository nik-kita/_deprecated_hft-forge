import { WsReadyState } from '@hft-forge/types/common';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { KuWsClient } from '../..';
import { MockGate } from './mocks';


export function disconnectDescribe(
    name: `Check /.disconnect/ method of /KuWsClient/`,
    getMocks: () => {
        mockApp: INestApplication,
        mockAppUrl: string,
    },
) {
    return describe(name, () => {
        let mockApp: INestApplication;
        let wsUrl: string;
        let mockGate: MockGate;
        let kuWsClient: KuWsClient;

        beforeEach(() => {
            const mocks = getMocks();

            mockApp = mocks.mockApp;
            wsUrl = mocks.mockAppUrl.replace('http', 'ws');
            mockGate = mockApp.get(MockGate);
            kuWsClient = new KuWsClient();
        });

        it('Should disconnect', async () => {
            await kuWsClient.connect(wsUrl);

            expect(kuWsClient.getWsState()).toBe('OPEN' satisfies WsReadyState);

            
            const offTimeout = setTimeout(async () => {
                await kuWsClient.__getOriginWs().close();
                expect('not').toBe('here');
            }, 3000);
            
            await kuWsClient.disconnect();

            clearTimeout(offTimeout);

            expect(kuWsClient.getWsState()).toBe('CLOSED' satisfies WsReadyState);
            expect('any errors').not.toBe('happen');
        });
    });
}
