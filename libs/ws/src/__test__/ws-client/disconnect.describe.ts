import { WsReadyState } from '@hft-forge/types/common';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { WsClientService } from '../..';
import { MockGate } from './mocks';


export function disconnectDescribe(
    name: `Check /WsClientService.disconnect()/`,
    getMocks: () => {
        mockApp: INestApplication,
        mockAppUrl: string,
    },
) {
    return describe(name, () => {
        let mockApp: INestApplication;
        let wsUrl: string;
        let mockGate: MockGate;
        let wsClientService: WsClientService;

        beforeEach(() => {
            const mocks = getMocks();

            mockApp = mocks.mockApp;
            wsUrl = mocks.mockAppUrl.replace('http', 'ws');
            mockGate = mockApp.get(MockGate);
            wsClientService = new WsClientService();
        });

        it('Should disconnect', async () => {
            await wsClientService.connect(wsUrl);

            expect(wsClientService.getWsState()).toBe('OPEN' satisfies WsReadyState);

            
            const offTimeout = setTimeout(async () => {
                await wsClientService.__getOriginWs().close();
                expect('not').toBe('here');
            }, 3000);
            
            await wsClientService.disconnect();

            clearTimeout(offTimeout);

            expect(wsClientService.getWsState()).toBe('CLOSED' satisfies WsReadyState);
            expect('any errors').not.toBe('happen');
        });
    });
}
