import { INestApplication, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { WebSocketGateway } from '@nestjs/websockets';
import { KuWsClient } from '../..';

@WebSocketGateway()
class MockGate { }

@Module({ providers: [MockGate] })
class MockApp { }

describe(KuWsClient.name, () => {
    let mockApp: INestApplication;
    let url: string | null;

    beforeEach(async () => {
        mockApp = await NestFactory.create(MockApp, { logger: false });
        mockApp.useWebSocketAdapter(new WsAdapter(mockApp));

        await mockApp.listen(0);

        url = await mockApp.getUrl();
    });

    it('Should prepare mock app', () => {
        expect(mockApp).toBeDefined();
        expect(url).toMatch(/http.+:/);
    });

    afterEach(async () => {
        await mockApp?.close();

        url = null;
    });
});
