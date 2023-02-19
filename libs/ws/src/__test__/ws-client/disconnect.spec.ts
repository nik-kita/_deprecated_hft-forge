import { WsReadyState } from '@hft-forge/types/common';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { WsClientService } from '../..';
import { MockApp } from './mocks';


describe(`Check /client.disconnect()/`, () => {
    let mockApp: INestApplication;
    let wsUrl: string;
    let client: WsClientService;

    beforeEach(async () => {
        mockApp = await NestFactory.create(MockApp, { logger: false });
        mockApp.useWebSocketAdapter(new WsAdapter(mockApp));

        await mockApp.listen(0, 'localhost');

        const mockAppUrl = await mockApp.getUrl();

        wsUrl = mockAppUrl.replace('http', 'ws');
        client = new WsClientService();
    });

    afterEach(async () => {
        await mockApp?.close();
    });

    it('Should disconnect', async () => {
        await client.connect(wsUrl);

        expect(client.getWsState()).toBe('OPEN' satisfies WsReadyState);


        const offTimeout = setTimeout(async () => {
            await client.__getOriginWs().close();
            expect('not').toBe('here');
        }, 3000);

        await client.disconnect();

        clearTimeout(offTimeout);

        expect(client.getWsState()).toBe('CLOSED' satisfies WsReadyState);
        expect('any errors').not.toBe('happen');
    });
});

