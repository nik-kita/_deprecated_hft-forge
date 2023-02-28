import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { WsClientService } from '../../lib/ws-client.service';
import { MockApp, MockGate } from './mocks';

describe('WsClientService | .connect() | 001', () => {
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

    it('Should return object with "on/once message" hofs', async () => {
        const actual = await client.connect(wsUrl);

        expect(actual.onMessage).toBeInstanceOf(Function);
        expect(actual.onceMessage).toBeInstanceOf(Function);

        await client.disconnect();
    });
});
