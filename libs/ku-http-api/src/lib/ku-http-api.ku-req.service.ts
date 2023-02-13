import { HttpService } from '@hft-forge/http';
import { KuEnv, KuReq, KuReq_order_book_level_2, KU_BASE_URL, KU_GET_ENDPOINT } from '@hft-forge/types/ku';
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

    private async getFullOrderBook(symbol: string) {
        const payload: KuReq_order_book_level_2 = {
            endpoint: KU_GET_ENDPOINT.order_book.full,
            method: 'GET',
            query: { symbol },
        };
        
        return this.sendRequest(payload);
    }

    private sendRequest(payload: KuReq<any, any, any, any>) {
        const headers = this.signGeneratorService.generateHeaders(payload, this.keys);
        const url = `${KU_BASE_URL}${payload.endpoint}`;
        const { endpoint, ...options } = { ...payload, headers };

        return this.httpService.req(url, options);
    }
}
