import { WsClientService } from '@hft-forge/ws';


export class ConnectionManager {
    
    private constructor(private wsClient: WsClientService) {
        ConnectionManager.sockets.set(wsClient, new ConnectionManager(wsClient));
        
        wsClient.__getOriginWs().once('close', () => {
            ConnectionManager.sockets.delete(wsClient);
        });
    }

    private static sockets = new WeakMap<WsClientService, ConnectionManager>();

    public static async  init(wsClient: WsClientService, {
        token,
        id,
        endpoint,
    }: {
        token: string,
        id: string,
        endpoint: string,
    }) {
        const manager = new ConnectionManager(wsClient);

        await wsClient.connect(endpoint, { token, id });

        return manager;
    }
}
