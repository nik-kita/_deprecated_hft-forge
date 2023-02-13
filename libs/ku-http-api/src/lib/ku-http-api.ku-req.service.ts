import { HttpService } from '@hft-forge/http';
import { HttpMethod } from '@hft-forge/types/common';
import { KuEnv, KuSignOptions, KU_BASE_URL, KU_ENV_KEYS, KU_GET_ENDPOINT } from '@hft-forge/types/ku';
import { BindThis } from '@hft-forge/utils';
import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { KuSignGeneratorService } from './ku-http-api.sign-generator.service';

@Injectable()
@BindThis()
export class KuReq {
    private keys: KuEnv;

    constructor(
        private httpService: HttpService,
        private signGeneratorService: KuSignGeneratorService,
        private configService: ConfigService<KuEnv>,
    ) {
        const keys = {
            API_KEY: this.configService.get('API_KEY'),
            API_SECRET: this.configService.get('API_SECRET'),
            API_PASSPHRASE: this.configService.get('API_PASSPHRASE'),
        };

        if (Object.values(keys).some((v) => !v)) {
            throw new Error(`Provide ${KU_ENV_KEYS} to for sign request!`);
        }

        this.keys = keys;
    }

    public get() {

        return {
            order_book: {
                full: this.getFullOrderBook,
            },
        };
    }

    private async getFullOrderBook(symbol: string) {
        const method: HttpMethod = 'GET';
        const query = { symbol };
        const endpoint = KU_GET_ENDPOINT.order_book.full;
        const signOptions: KuSignOptions = {
            endpoint,
            method,
            params: query,
        };
        const headers = this.signGeneratorService.generateHeaders(signOptions, this.keys);
        const url = `${KU_BASE_URL}${endpoint}`;


        return this.httpService.req(url, {
            headers,
            method,
            query,
        });
    }
}
