import { INestApplication, Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { WsAdapter } from "@nestjs/platform-ws";
import { WebSocketGateway } from "@nestjs/websockets";
import { WebSocket } from 'ws';

describe('Check some non-standard "on event"/"async await" situations', () => {
    @WebSocketGateway()
    class MockGate { }
    @Module({
        providers: [MockGate],
    })
    class MockApp { }

    let mockApp: INestApplication;

    beforeEach(async () => {
        mockApp = await NestFactory.create(MockApp, { logger: false });

        mockApp.useWebSocketAdapter(new WsAdapter(mockApp));

        await mockApp.listen(0);
    });

    afterEach(async () => {
        await mockApp?.close();
    });

    it('Should not be error if await onClose promise many times', async () => {
        const url = await mockApp.getUrl();
        const wsClient = new WebSocket(url.replace('http', 'ws'));
        let onCloseCounter = 0;
        const closePromise = new Promise<object>((resolve) => {
            wsClient.on('close', () => {
                ++onCloseCounter;
                resolve({ hello: 'world' });
            });
        });

        await new Promise((resolve) => setTimeout(resolve, 2000));

        wsClient.close();

        expect(await closePromise).toEqual({ hello: 'world' });
        expect(onCloseCounter).toBe(1);
        expect(await closePromise).toEqual({ hello: 'world' });
        expect(onCloseCounter).toBe(1);
        expect(await closePromise).toBe(await closePromise);
        expect(await closePromise).not.toBe({ hello: 'world' });
    });

    it('Should not be error if close socket many times', async () => {
        const url = await mockApp.getUrl();
        const wsClient = new WebSocket(url.replace('http', 'ws'));
        let onCloseCounter = 0;
        const closePromise = new Promise<object>((resolve) => {
            wsClient.on('close', () => {
                ++onCloseCounter;
                resolve({ hello: 'world' });
            });
        });

        await new Promise((resolve) => setTimeout(resolve, 2000));

        wsClient.close();
        wsClient.close();
        wsClient.close();
        wsClient.close();
        wsClient.close();

        expect(await closePromise).toEqual({ hello: 'world' });
        expect(onCloseCounter).toBe(1);
        wsClient.close();
        wsClient.close();
        await new Promise((resolve) => setTimeout(resolve, 2000));
        wsClient.close();
        wsClient.close();
        expect(await closePromise).toEqual({ hello: 'world' });
        expect(onCloseCounter).toBe(1);
        expect(await closePromise).toBe(await closePromise);
        expect(await closePromise).not.toBe({ hello: 'world' });
    });
});
