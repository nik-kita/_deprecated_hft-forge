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

    connect(url: `ws${string}`) {
        return new Promise<void>((resolve, reject) => {
            const wsState = this.getWsState() || 'OPEN';
            const open = () => {
                this.ws = new WebSocket(url);
                this.ws.once('open', resolve);
            };
            const onClose = () => new Promise((rs, rj) => {
                this.ws.once('close', rs);
                this.ws.close();
            });
            const resolver: Record<WsReadyState, () => void> = {
                OPEN: () => {
                    if (this.ws.url === url) {
                        resolve();
                    } else {
                        onClose().then(open);
                    }
                },
                CLOSED: open,
                CLOSING: () => onClose().then(open),
                CONNECTING: () => this.ws.on('open', resolve),
            };

            resolver[wsState]();
        });
    }
}
