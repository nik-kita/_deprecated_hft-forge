import { HttpMethod } from '@hft-forge/types/common';
import { KuEnv, KuReq } from '@hft-forge/types/ku';
import { qsFromObj } from '@hft-forge/utils';
import { Injectable } from "@nestjs/common";
import * as forge from 'node-forge';

@Injectable()
export class KuSignGeneratorService {
    public generateHeaders<
    M extends HttpMethod,
    E extends string,
    Q extends object | undefined = undefined,
    B extends object | undefined = undefined,
    >(options: KuReq<M, E, Q, B>, credentials: KuEnv) {
        const {
            API_KEY,
            API_PASSPHRASE,
            API_SECRET,
        } = credentials;
        const {
            method, endpoint, query, body,
        } = options as KuReq<M, E, object, object>;
        const _endpoint = query && Object.keys(query).length
            ? `${endpoint}?${qsFromObj(query)}`
            : endpoint;
        const timestamp = Date.now();
        const stringToSign = this.stringToSign(_endpoint, timestamp, method, body);
        const signature = this.signature(stringToSign, API_SECRET);
        const signedPassphrase = this.signature(API_PASSPHRASE, API_SECRET);

        return {
            'KC-API-SIGN': signature,
            'KC-API-TIMESTAMP': timestamp.toString(),
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

        const modern = forge.util.encode64(hmac.digest().bytes());

        return modern;
    }
}

