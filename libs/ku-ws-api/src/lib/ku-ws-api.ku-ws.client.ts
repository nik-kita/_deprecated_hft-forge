import { WsReadyState, WS_READY_STATE_V_K } from '@hft-forge/types/common';
import { BindThis } from '@hft-forge/utils';
import { Injectable } from "@nestjs/common";
import { WebSocket } from 'ws';

@Injectable()
@BindThis()
export class KuWsClient {
    private ws: WebSocket;

    private getWsState(): WsReadyState | null {
        if (!this.ws) return null;

        return WS_READY_STATE_V_K[this.ws.readyState];
    }
}
