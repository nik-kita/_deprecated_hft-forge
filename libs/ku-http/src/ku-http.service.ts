import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CurrencyPair, KuEnvKeys } from '@project/types/ku/core';
import { KuHttp, KuReq } from "@project/types/ku/http";
import { request } from 'undici';
import { SignGenerator } from "./sign-generator";

type _Keys = Record<KuEnvKeys, string>;

@Injectable()
export class KuHttpService {
    private signGenerator = new SignGenerator();
    private keys: _Keys;
    private http = request;

    constructor(
        private configService: ConfigService<_Keys, true>,
    ) {
        this.keys = {
            API_KEY: this.configService.get('API_KEY'),
            API_SECRET: this.configService.get('API_SECRET'),
            API_PASSPHRASE: this.configService.get('API_PASSPHRASE'),
        };
    }

    public async POST_apply_public_connect_token() {
        const url: KuReq<'/api/v1/bullet-public'>[0]['url'] = 'https://api.kucoin.com/api/v1/bullet-public';
        const payload: KuReq<'/api/v1/bullet-public'>[1] = {
            method: 'POST'
        };

        return this
            .http(url, payload)
            .then(({ body }) => body.json() as Promise<KuHttp['/api/v1/bullet-public']['res']>)
            .then(({ data: { instanceServers: [{endpoint }], token } }) => ({
                endpoint,
                token,
            })) ;
    }

    public async GET_full_order_book(symbol: CurrencyPair) {
        const url: KuReq<'/api/v3/market/orderbook/level2'>[0]['url'] = 'https://api.kucoin.com/api/v3/market/orderbook/level2';
        const forSignature: KuReq<'/api/v3/market/orderbook/level2'>[0]['forSignature'] = {
            endpoint: '/api/v3/market/orderbook/level2',
            method: 'GET',
            query: { symbol },
        };
        const headers = this.signGenerator.generateHeaders(forSignature, this.keys);
        const payload: KuReq<'/api/v3/market/orderbook/level2'>[1] = {
            headers,
            method: 'GET',
            query: { symbol },
        };

        return this.http(url, payload);
    }
}
