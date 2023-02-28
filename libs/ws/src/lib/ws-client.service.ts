import { WsReadyState, WS_READY_STATE_V_K } from '@hft-forge/types/common';
import { qsFromObj } from '@hft-forge/utils';
import { BindThis } from '@hft-forge/utils/decorators';
import { Injectable } from "@nestjs/common";
import { RawData, WebSocket } from 'ws';

type _OnMessage = (ws: WebSocket, data: RawData, isBinary: boolean) => void;
@Injectable()
@BindThis()
export class WsClientService {
    private ws: WebSocket;

    getWsState(): WsReadyState | null {
        if (!this.ws) return null;

        return WS_READY_STATE_V_K[this.ws.readyState];
    }

    __getOriginWs() { return this.ws; }

    connect(url: `ws${string}` | string, data?: object) {
        const _url = data
            ? `${url}?${qsFromObj(data)}`
            : url;

        return new Promise<{
            onceMessage: (action: _OnMessage) => void,
            onMessage: (action: _OnMessage) => void,
        }>((resolve, reject) => {
            const onOpenCb = (currWs: WebSocket) => {
                resolve({
                    onceMessage: (action: _OnMessage) => currWs.once('message', action),
                    onMessage: (action: _OnMessage) => currWs.on('message', action),
                });
            };
            const open = () => {
                this.ws = new WebSocket(_url);
                this.ws.once('open', () => onOpenCb(this.ws));
            };

            if (!this.ws) {
                open();
            } else if (this.getWsState() === 'OPEN') {
                if (this.ws.url === _url) onOpenCb(this.ws);
                else {
                    this.ws.once('close', open);
                    this.ws.close();
                }
            } else if (this.getWsState() === 'CONNECTING') {
                if (this.ws.url === _url) this.ws.once('open', onOpenCb);
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
