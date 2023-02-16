import { describePortal } from '@hft-forge/utils';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { WsClientService } from '../..';
import { connectDescribe } from './connect.describe';
import { disconnectDescribe } from './disconnect.describe';
import { MockApp } from './mocks';


describe(WsClientService.name, () => {
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
        'Check /WsClientService.connect()/',
        () => ({ mockApp, mockAppUrl }),
    );

    describePortal(
        disconnectDescribe,
        'Check /WsClientService.disconnect()/',
        () => ({ mockApp, mockAppUrl }),
    );

    afterEach(async () => {
        await mockApp?.close();
    });
});
