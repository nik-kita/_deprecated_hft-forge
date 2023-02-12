import { HttpService } from '@hft-forge/http';
import { KuSignOptions, KU_GET_ENDPOINT } from '@hft-forge/types/ku';
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

    public get = {
        order_book: {
            full: this.getFullOrderBook,
        }
    };

    private getFullOrderBook(symbol: string) {
        const signOptions: KuSignOptions = {
            url: KU_GET_ENDPOINT.order_book.full,
            method: 'GET',
            params: { symbol },
        };
        const headers = this.signGeneratorService.generateHeaders(signOptions, this.keys);
        const { url, ...reqOptions } = { ...signOptions, headers };

        return this.httpService.req(url, reqOptions);
    }
}
