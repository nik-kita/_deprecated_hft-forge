import { describePortal } from '@hft-forge/utils';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { KuWsClient } from '../..';
import { connectDescribe } from './connect.describe';
import { disconnectDescribe } from './disconnect.describe';
import { MockApp } from './mocks';


describe(KuWsClient.name, () => {
    let mockApp: INestApplication;
    let mockAppUrl: string;

    beforeEach(async () => {
        mockApp = await NestFactory.create(MockApp, { logger: false });
        mockApp.useWebSocketAdapter(new WsAdapter(mockApp));

        await mockApp.listen(0, 'localhost');

        mockAppUrl = await mockApp.getUrl();
    });

    it('Should prepare mock app', () => {
        expect(mockApp).toBeDefined();
        expect(mockAppUrl).toMatch(/http.+:/);
    });

    describePortal(
        connectDescribe,
        'Check /KuWsClient.connection/',
        () => ({ mockApp, mockAppUrl }),
    );

    describePortal(
        disconnectDescribe,
        'Check /.disconnect/ method of /KuWsClient/',
        () => ({ mockApp, mockAppUrl }),
    );

    afterEach(async () => {
        await mockApp?.close();
    });
});
