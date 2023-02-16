import { WsReadyState, WS_READY_STATE_V_K } from '@hft-forge/types/common';
import { BindThis } from '@hft-forge/utils';
import { Injectable } from "@nestjs/common";
import { WebSocket } from 'ws';

@Injectable()
@BindThis()
export class WsClientService {
    private ws: WebSocket;

    getWsState(): WsReadyState | null {
        if (!this.ws) return null;

        return WS_READY_STATE_V_K[this.ws.readyState];
    }

    __getOriginWs() { return this.ws; }

    connect(url: `ws${string}` | string) {
        return new Promise<void>((resolve, reject) => {
            const onOpenCb = () => {
                resolve();
            };
            const open = () => {
                this.ws = new WebSocket(url);
                this.ws.once('open', onOpenCb);
            };

            if (!this.ws) {
                open();
            } else if (this.getWsState() === 'OPEN') {
                if (this.ws.url === url) resolve();
                else {
                    this.ws.once('close', open);
                    this.ws.close();
                }
            } else if (this.getWsState() === 'CONNECTING') {
                if (this.ws.url === url) this.ws.once('open', resolve);
                else {
                    this.ws.once('open', () => {
                        this.ws.once('close', open);
                        this.ws.close();
                    });
                }
            } else if (this.getWsState() === 'CLOSING') {
                this.ws.once('close', open);
            } else if (this.getWsState() === 'CLOSED') {
                open();
            }
        });
    }

    disconnect() {
        return new Promise<void>((resolve, reject) => {
            const onCloseCb = () => {
                resolve();
            };

            this.ws?.once('close', onCloseCb);

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
