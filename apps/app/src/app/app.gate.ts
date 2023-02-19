import { AppGateEvent } from '@hft-forge/types/app';
import { genUniqueStr } from '@hft-forge/utils';
import { SubMessageLikeMethod } from '@hft-forge/utils/decorators';
import { Logger } from "@nestjs/common";
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from "@nestjs/websockets";
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

    constructor(private forgeStoreService: ForgeStoreService) { }

    @SubMessageLikeMethod()
    forgeState(@ConnectedSocket() client) {
        this.forgeStoreService.addSubscriber(client, this.clients.wsName.get(client)!);
    }


    handleConnection(client: WebSocket) {
        const name = genUniqueStr();

        this.clients.wsName.set(client, name);
        this.clients.nameWs.set(name, client);
        this.logger.debug(`+ ${name}`);
    }

    handleDisconnect(client: WebSocket, ...args: any[]) {
        const name = this.clients.wsName.get(client);

        this.forgeStoreService.rmSubscriber(name!);
        this.clients.nameWs.delete(name!);
        this.logger.debug(`- ${name}`);
    }
}
