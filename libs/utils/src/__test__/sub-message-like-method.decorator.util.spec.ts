import { GateMessage } from '@hft-forge/types/common';
import { INestApplication, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { WebSocketGateway } from '@nestjs/websockets';
import { WebSocket } from 'ws';
import { SubMessageLikeMethod } from '..';

const testMethod = 'testMethod' as const;

type ITestMethod = Record<typeof testMethod, (...args: any[]) => any>;


@WebSocketGateway()
class TestGate implements ITestMethod {
    public lastCall: any;

    @SubMessageLikeMethod()
    testMethod(...args: any[]) {
        this.lastCall = args[1];
    }
}

@Module({ providers: [TestGate] })
class TestModule { }



describe(SubMessageLikeMethod.name, () => {
    let app: INestApplication;
    let url: string;
    let gate: TestGate;
    let client: WebSocket;

    beforeAll(async () => {
        app = await NestFactory.create(TestModule, {
            logger: false,
        });

        app.useWebSocketAdapter(new WsAdapter(app));

        gate = app.get<TestGate>(TestGate);

        await app.listen(0);

        url = (await app.getUrl()).replace('http', 'ws');
    });

    it('Should subscribe to message like method name', async () => {
        const payload: GateMessage<typeof testMethod, any> = {
            event: 'testMethod',
            data: { hello: 'world' },
        };

        expect(gate.lastCall).toBeUndefined();

        client = new WebSocket(url);

        await new Promise<void>((resolve) => {
            client.on('open', () => {
                client.send(JSON.stringify(payload));

                resolve();
            });
        });
        await new Promise((resolve) => setTimeout(resolve, 2_000));

        expect(gate.lastCall).toEqual(payload.data);
    });

    afterAll(async () => {
        client.readyState === WebSocket.OPEN && await new Promise((resolve) => {
            client.on('close', resolve);

            client.close();
        });
        await app.close();
    });
});

