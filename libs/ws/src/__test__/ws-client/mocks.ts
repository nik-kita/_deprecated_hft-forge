import { Module } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway()
export class MockGate implements OnGatewayConnection, OnGatewayDisconnect {
    connectionCounts = 0;
    
    handleDisconnect() {
        --this.connectionCounts;
    }

    handleConnection() {
        ++this.connectionCounts;
    }
}

@Module({ providers: [MockGate] })
export class MockApp { }
