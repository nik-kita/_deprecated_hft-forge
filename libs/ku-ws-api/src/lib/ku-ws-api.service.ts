import { HttpService } from '@hft-forge/http';
import { WsClientService } from '@hft-forge/ws';
import { Injectable } from "@nestjs/common";

@Injectable()
export class KuWsApiService {
    constructor(
        private wsClient: WsClientService,
        private httpClient: HttpService,
    ) {}
}
