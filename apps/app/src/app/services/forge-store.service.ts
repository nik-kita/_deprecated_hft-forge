import { initForgeStore } from "@hft-forge/forge-store";
import { AppGateEvent } from '@hft-forge/types/app';
import { GateMessage } from '@hft-forge/types/common';
import { ForgeState } from '@hft-forge/types/forge-store';
import { Injectable } from "@nestjs/common";
import { WebSocket } from "ws";

@Injectable()
export class ForgeStoreService {
    private store = initForgeStore();
    private subscribers = new Map<string, WebSocket>();

    constructor() {
        this.store.subscribe(() => {
            const message = this.genMessage();

            this.subscribers.forEach((s) => {
                if (s.readyState === WebSocket.OPEN) {
                    s.send(message);
                }
            });
        });
    }

    addSubscriber(client: WebSocket, id: string) {
        client.send(this.genMessage());
        this.subscribers.set(id, client);
    }

    rmSubscriber(id: string) {
        this.subscribers.delete(id);
    }

    dispatch = this.store.dispatch;

    getState = this.store.getState;

    private genMessage() {
        const state: GateMessage<AppGateEvent, ForgeState> = {
            event: 'forgeState',
            data: this.store.getState(),
        };

        return JSON.stringify(state);
    }
}
