import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { KuWsClient } from '../..';
import describe_KuWsClient_connect from './ku-ws-client.connect.describe';
import { MockApp } from './mocks';

describe(KuWsClient.name, () => {
    let mockApp: INestApplication;
    let url: string | null;

    beforeEach(async () => {
        mockApp = await NestFactory.create(MockApp, { logger: false });
        mockApp.useWebSocketAdapter(new WsAdapter(mockApp));
        
        await mockApp.listen(0, 'localhost');
        
        url = await mockApp.getUrl();
    });

    it('Should prepare mock app', () => {
        expect(mockApp).toBeDefined();
        expect(url).toMatch(/http.+:/);
    });
    
    describe_KuWsClient_connect(() => ({ mockApp, mockAppUrl: url! }));

    afterEach(async () => {
        await mockApp?.close();

        url = null;
    });
});
