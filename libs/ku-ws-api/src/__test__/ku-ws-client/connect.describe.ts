import { WsReadyState } from '@hft-forge/types/common';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { KuWsClient } from '../../lib/ku-ws-api.ku-ws.client';
import { MockGate } from './mocks';


export function connectDescribe(
    name: 'Check /KuWsClient.connection/',
    getMocks: () => {
        mockApp: INestApplication,
        mockAppUrl: string,
    },
) {
    return describe('Check /.connect()/ method of /KuWsClient/', () => {
        let mockApp: INestApplication;
        let wsUrl: string;
        let client: KuWsClient;
        let mockGate: MockGate;

        beforeEach(() => {
            const mocks = getMocks();

            mockApp = mocks.mockApp;
            wsUrl = mocks.mockAppUrl.replace('http', 'ws');
            client = new KuWsClient();
            mockGate = mockApp.get(MockGate);
        });

        it('MockApp should be defined', () => {
            expect(mockApp).toBeDefined();
            expect(wsUrl).toMatch(/^ws/);
        });

        it('Should connect to mockApp', async () => {
            expect(mockGate.connectionCounts).toBe(0);

            await client.connect(wsUrl);

            expect(mockGate.connectionCounts).toBe(1);

            const originWs = client.__getOriginWs();

            await new Promise((resolve) => {
                originWs.on('close', resolve);
                originWs.close();
            });

            expect(mockGate.connectionCounts).toBe(0);
            expect('errors').not.toBe('throwed');
        });

        it('Should connect only once even if call /.connect()/ many times', async () => {
            const CONNECTIONS_COUNT_ON_TEST_START = mockGate.connectionCounts;
            let expectedConnCount = CONNECTIONS_COUNT_ON_TEST_START;

            await client.connect(wsUrl);

            expect(mockGate.connectionCounts).toBe(++expectedConnCount);

            await client.connect(wsUrl);
            await client.connect(wsUrl);
            await client.connect(wsUrl);
            await client.connect(wsUrl);

            expect(mockGate.connectionCounts).toBe(expectedConnCount);

            await new Promise((resolve) => {
                const origin = client.__getOriginWs();

                origin.on('close', resolve);

                origin.close();
            });
        });

        it('Should connect (ws = null), disconnect (ws = ws(closed)), connect again', async () => {
            const CONNECTIONS_COUNT_ON_TEST_START = mockGate.connectionCounts;
            let expectedConnCount = CONNECTIONS_COUNT_ON_TEST_START;

            expect(client.getWsState()).toBe(null);
            expect(expectedConnCount).toBe(0);

            await client.connect(wsUrl);

            ++expectedConnCount;

            expect(client.getWsState()).toBe('OPEN' satisfies WsReadyState);
            expect(mockGate.connectionCounts).toBe(expectedConnCount);

            await new Promise((resolve) => {
                const origin = client.__getOriginWs();

                origin.on('close', resolve);

                origin.close();
            });

            --expectedConnCount;

            expect(mockGate.connectionCounts).toBe(expectedConnCount);

            await client.connect(wsUrl);

            ++expectedConnCount;

            expect(mockGate.connectionCounts).toBe(expectedConnCount);
            expect(client.getWsState()).toBe('OPEN' satisfies WsReadyState);

            await new Promise((resolve) => {
                const origin = client.__getOriginWs();

                origin.on('close', resolve);

                origin.close();
            });
        });
    });
}
