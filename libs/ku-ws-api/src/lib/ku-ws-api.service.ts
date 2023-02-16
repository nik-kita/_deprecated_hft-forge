import { Injectable } from "@nestjs/common";
import { WsClientService } from '@hft-forge/ws';

@Injectable()
export class KuWsApiService {
    constructor(private wsClient: WsClientService) {}
}
