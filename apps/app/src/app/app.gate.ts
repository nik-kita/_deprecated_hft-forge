import { AppGateEvent } from '@hft-forge/types/app';
import { genUniqueStr, SubMessageLikeMethod } from '@hft-forge/utils';
import { Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from "@nestjs/websockets";
import { WebSocket } from 'ws';
import { ForgeStoreService } from './services/forge-store.service';

@WebSocketGateway()
export class AppGate implements
    Record<AppGateEvent, (...args: any[]) => any>,
    OnGatewayConnection,
    OnGatewayDisconnect {
    private logger = new Logger(AppGate.name);
    private clients = {
        wsName: new WeakMap<WebSocket, string>(),
        nameWs: new Map<string, WebSocket>(),
    };

    constructor(private forgeStoreService: ForgeStoreService) {}

    @SubMessageLikeMethod()
    forgeState() {
        // TODO
    }


    handleConnection(client: WebSocket) {
        const name = genUniqueStr();

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
