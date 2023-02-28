import { HttpService } from '@hft-forge/http';
import { CurrencyPair, KU_ENV_KEYS } from '@hft-forge/types/ku/common';
import { BindThis } from '@hft-forge/utils/decorators';
import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { KuReq } from '@hft-forge/types/ku/http';
import { KuSignGeneratorService } from './ku-http-api.sign-generator.service';

type _Keys = Record<(typeof KU_ENV_KEYS)[number], string>;
@Injectable()
@BindThis()
export class KuReqService {
    private keys: _Keys;

    constructor(
        private httpService: HttpService,
        private signGeneratorService: KuSignGeneratorService,
        private configService: ConfigService<_Keys, true>,
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
        const url: KuReq<'/api/v1/bullet-public'>[0]['url'] = 'https://api.kucoin.com/api/v1/bullet-public';
        const payload: KuReq<'/api/v1/bullet-public'>[1] = {
            method: 'POST'
        };

        return this.httpService.req(url, payload);
    }

    private async getFullOrderBook(symbol: CurrencyPair) {
        const url: KuReq<'/api/v3/market/orderbook/level2'>[0]['url'] = 'https://api.kucoin.com/api/v3/market/orderbook/level2';
        const forSignature: KuReq<'/api/v3/market/orderbook/level2'>[0]['forSignature'] = {
            endpoint: '/api/v3/market/orderbook/level2',
            method: 'GET',
            query: { symbol },
        };
        const headers = this.signGeneratorService.generateHeaders(forSignature, this.keys);
        const payload: KuReq<'/api/v3/market/orderbook/level2'>[1] = {
            headers,
            method: 'GET',
            query: { symbol },
        };

        return this.httpService.req(url, payload);
    }
}
