import { HttpService } from '@hft-forge/http';
import { HttpMethod } from '@hft-forge/types/common';
import { KuSignOptions, KU_BASE_URL, KU_GET_ENDPOINT } from '@hft-forge/types/ku';
import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { KuSignGeneratorService } from './ku-http-api.sign-generator.service';

type ConfigType = Parameters<KuSignGeneratorService['generateHeaders']>[1];

@Injectable()
export class KuReq {
    private keys: ConfigType;

    constructor(
        private httpService: HttpService,
        private signGeneratorService: KuSignGeneratorService,
        private configService: ConfigService<ConfigType>,
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
                full: this.getFullOrderBook.bind(this) as typeof this.getFullOrderBook,
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
