import { HttpMethod } from '@hft-forge/types/common';
import { KuSignOptions } from '@hft-forge/types/ku';
import { qsFromObj } from '@hft-forge/utils';
import { Injectable } from "@nestjs/common";
import * as forge from 'node-forge';



@Injectable()
export class KuSignGeneratorService {
    public generateHeaders(options: KuSignOptions, credentials: {
        API_KEY: string,
        API_SECRET: string,
        API_PASSPHRASE: string,
    }) {
        const {
            API_KEY,
            API_PASSPHRASE,
            API_SECRET,
        } = credentials;
        const {
            method, endpoint, params, body,
        } = options;
        const _endpoint = params && Object.keys(params).length
            ? `${endpoint}?${qsFromObj(params)}`
            : endpoint;
        const timestamp = Date.now();
        const stringToSign = this.stringToSign(_endpoint, timestamp, method, body);
        const signature = this.signature(stringToSign, API_SECRET);
        const signedPassphrase = this.signature(API_PASSPHRASE, API_SECRET);

        return {
            'KC-API-SIGN': signature,
            'KC-API-TIMESTAMP': String(timestamp),
            'KC-API-KEY': API_KEY,
            'KC-API-PASSPHRASE': signedPassphrase,
            'KC-API-KEY-VERSION': '2',
            'Content-Type': 'application/json',
        };

    }

    private stringToSign(
        endpoint: string,
        timestamp: number,
        method: HttpMethod,
        body?: object | string,
    ) {
        let _body: string | object = body ?? '';

        if (Object(body) === body) {
            _body = JSON.stringify(body);
        }

        const result = timestamp + method + endpoint + _body;

        return result;
    }

    private signature(payload: string, apiSecret: string) {
        const hmac = forge.hmac.create();
        
        hmac.start('sha256', apiSecret);
        hmac.update(payload);
        
        return forge.util.encode64(hmac.digest().bytes());
    }
}
