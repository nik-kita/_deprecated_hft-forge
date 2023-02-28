import { WsReadyState } from '@hft-forge/types/common';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { WsClientService } from '../../lib/ws-client.service';
import { MockApp, MockGate } from './mocks';

describe('WsClientService | .connect() | 000', () => {
    let mockApp: INestApplication;
    let wsUrl: string;
    let client: WsClientService;
    let mockGate: MockGate;

    beforeEach(async () => {
        mockApp = await NestFactory.create(MockApp, { logger: false });
        mockApp.useWebSocketAdapter(new WsAdapter(mockApp));

        await mockApp.listen(0, 'localhost');

        const mockAppUrl = await mockApp.getUrl();

        wsUrl = mockAppUrl.replace('http', 'ws');
        client = new WsClientService();
        mockGate = mockApp.get(MockGate);
    });

    afterEach(async () => {
        await mockApp?.close();
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
