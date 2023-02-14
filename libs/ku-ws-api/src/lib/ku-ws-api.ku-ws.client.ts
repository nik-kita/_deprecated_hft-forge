import { Injectable } from "@nestjs/common";
import { WebSocket } from 'ws';
import { KU_BASE_URL } from '@hft-forge/types/ku';



@Injectable()
export class KuWsClient {
    private ws = new WebSocket(KU_BASE_URL);

    private closePromise = new Promise<void>((resolve) => {
        this.ws.on('close', resolve);
    });

    private promises = [this.closePromise];

    public async close() {
        this.ws.close();

        await this.closePromise;
    }
}
