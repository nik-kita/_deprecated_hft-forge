import { WsReadyState, WS_READY_STATE_V_K } from '@hft-forge/types/common';
import { BindThis } from '@hft-forge/utils';
import { Injectable } from "@nestjs/common";
import { WebSocket } from 'ws';

@Injectable()
@BindThis()
export class KuWsClient {
    private ws: WebSocket;

    getWsState(): WsReadyState | null {
        if (!this.ws) return null;

        return WS_READY_STATE_V_K[this.ws.readyState];
    }

    __getOriginWs() { return this.ws; }

    // TODO rewrite like /.disconnect()/ (without inner promises)
    connect(url: `ws${string}` | string) {
        return new Promise<void>((resolve, reject) => {
            const wsState = this.getWsState() || 'CLOSED';
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
                CONNECTING: () => this.ws.once('open', resolve),
            };

            resolver[wsState]();
        });
    }

    disconnect() {
        return new Promise<void>((resolve, reject) => {
            const onCloseCb = () => {
                resolve();
            };

            this.ws?.on('close', onCloseCb);

            if (!this.ws) {
                resolve();
            } else if (this.getWsState() === 'CLOSED') {
                this.ws.removeEventListener('close', onCloseCb);

                resolve();
            } else if (this.getWsState() === 'CLOSING') {
                // wait for 'close' event
            } else if (this.getWsState() === 'OPEN') {
                this.ws.close();
            } else if (this.getWsState() === 'CONNECTING') {
                this.ws.once('open', () => {
                    this.ws.close();
                });
            }
        });
    }
}
