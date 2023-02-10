import { Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from "@nestjs/websockets";
import { WebSocket } from 'ws';
import { faker } from '@faker-js/faker';

const genClientIdName = () => faker.helpers.unique(() => `${faker.animal.bird()} ${faker.name.fullName()}`);

@WebSocketGateway()
export class AppGate implements OnGatewayConnection, OnGatewayDisconnect {
    private logger = new Logger(AppGate.name);
    private clients = {
        wsName: new WeakMap<WebSocket, string>(),
        nameWs: new Map<string, WebSocket>(),
    };

    handleConnection(client: WebSocket) {
        const name = genClientIdName();

        this.clients.wsName.set(client, name);
        this.clients.nameWs.set(name, client);
        this.logger.debug(`+ ${name}`);
    }

    handleDisconnect(client: WebSocket, ...args: any[]) {
        const name = this.clients.wsName.get(client);

        this.clients.nameWs.delete(name);
        this.logger.debug(`- ${name}`);
    }
}
