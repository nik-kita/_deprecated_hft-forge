import { WsClientService } from '@hft-forge/ws';
import { INestApplication, Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { WsAdapter } from '@nestjs/platform-ws';
import { OnGatewayConnection, WebSocketGateway } from "@nestjs/websockets";
import { WebSocket } from "ws";
import { ConnectionManager } from '../../lib/connection-manager';



@WebSocketGateway()
class FakeGate implements OnGatewayConnection {
    private static onConnection: (client: WebSocket, ...args: any[]) => void = (client: WebSocket, ...args: any[]) => {
        client.send(JSON.stringify({ type: 'welcome' }));
    };

    public static setOnConnection(onConnection: typeof FakeGate.onConnection) {
        FakeGate.onConnection = onConnection;
    }

    handleConnection(client: any, ...args: any[]) {
        FakeGate.onConnection(client, ...args);
    }

}

@Module({
    providers: [FakeGate],
})
class FakeServer {}


describe('ConnectionManager | mvp | 000', () => {
    let fakeServer: INestApplication;
    let endpoint: string;
    
    beforeEach(async () => {
        fakeServer = await NestFactory.create(FakeServer, { logger: false });
        fakeServer.useWebSocketAdapter(new WsAdapter(fakeServer));

        await fakeServer.listen(0, 'localhost');

        const url = await fakeServer.getUrl();

        endpoint = url.replace('http', 'ws');

        console.log(endpoint);
    });

    it('.init()', async () => {
        const wsClient = new WsClientService();

        const connectionManager = await ConnectionManager.init(wsClient, { endpoint, id: Date.now().toString(), token: 'hello' });


        expect(connectionManager).toBeInstanceOf(ConnectionManager);
    });

    afterEach(async () => {
        await fakeServer?.close();
    });

});
