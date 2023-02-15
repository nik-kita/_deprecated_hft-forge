import { HttpService } from '@hft-forge/http';
import { KuEnv, KuReq, KuReq_apply_ws_public_connect_token, KuReq_order_book_level_2, KU_BASE_URL, KU_GET_ENDPOINT, KU_POST_ENDPOINT } from '@hft-forge/types/ku';
import { BindThis } from '@hft-forge/utils';
import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { KuSignGeneratorService } from './ku-http-api.sign-generator.service';

@Injectable()
@BindThis()
export class KuReqService {
    private keys: KuEnv;

    constructor(
        private httpService: HttpService,
        private signGeneratorService: KuSignGeneratorService,
        private configService: ConfigService<KuEnv, true>,
    ) {
        this.keys = {
            API_KEY: this.configService.get('API_KEY'),
            API_SECRET: this.configService.get('API_SECRET'),
            API_PASSPHRASE: this.configService.get('API_PASSPHRASE'),
        };
    }

    public get() {

        return {
            order_book: {
                full: this.getFullOrderBook,
            },
        };
    }

    public post() {

        return {
            apply_ws_connect_token: {
                public: this.postApplyWsConnectToken,
            },
        };
    }

    private postApplyWsConnectToken() {
        const payload: KuReq_apply_ws_public_connect_token = {
            endpoint: KU_POST_ENDPOINT.apply_ws_connect_token.public,
            method: 'POST'
        };

        return this.sendPublicRequest(payload);
    }

    private async getFullOrderBook(symbol: string) {
        const payload: KuReq_order_book_level_2 = {
            endpoint: KU_GET_ENDPOINT.order_book.full,
            method: 'GET',
            query: { symbol },
        };

        return this.sendPrivateRequest(payload);
    }

    private sendPublicRequest(payload: KuReq<any, any, any>) {
        const { endpoint, ...options } = payload;
        const url = `${KU_BASE_URL}${endpoint}`;

        return this.httpService.req(url, options);
    }

    private sendPrivateRequest(payload: KuReq<any, any, any, any>) {
        const headers = this.signGeneratorService.generateHeaders(payload, this.keys);
        const url = `${KU_BASE_URL}${payload.endpoint}`;
        const { endpoint, ...options } = { ...payload, headers };

        return this.httpService.req(url, options);
    }
}
