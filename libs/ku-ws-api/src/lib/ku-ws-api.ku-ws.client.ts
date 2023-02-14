import { BindThis } from '@hft-forge/utils';
import { Injectable } from "@nestjs/common";
import { WebSocket } from 'ws';
import { HftForgeError } from '@hft-forge/utils';


@Injectable()
@BindThis()
export class KuWsClient {
    private ws: WebSocket;

    private get wsState() {
        if (!this.ws) return null;

        switch (this.ws.readyState) {
            case WebSocket.CLOSED:
                return 'CLOSED' as const;
            case WebSocket.CLOSING:
                return 'CLOSING' as const;
            case WebSocket.CONNECTING:
                return 'CONNECTING' as const;
            case WebSocket.OPEN:
                return 'OPEN' as const;
        }
    }

    private get closePromise() {
        if (!this.wsState || ['CLOSED', 'CLOSING'].includes(this.wsState)) return Promise.resolve();

        return new Promise<void>((resolve) => {
            this.ws.on('close', resolve);
        });
    }

    private get openPromise() {
        if (!this.wsState) {
            throw new HftForgeError(`Impossible to wait on open ${KuWsClient.name} because it is null.`);
        }

        if (['CONNECTING', 'OPEN'].includes(this.wsState)) return Promise.resolve();

        return new Promise<void>((resolve) => {
            this.ws.on('open', resolve);
        });
    }

    private async close() {
        this.ws.close();

        await this.closePromise;
    }
}
