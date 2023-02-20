import { HttpMethod } from '@hft-forge/types/common';
import { KU_ENV_KEYS } from '@hft-forge/types/ku/common';
import { Endpoint, KuReq } from '@hft-forge/types/ku/http';
import { qsFromObj } from '@hft-forge/utils';
import { Injectable } from "@nestjs/common";
import * as nodeForge from 'node-forge';


@Injectable()
export class KuSignGeneratorService_copypast {
    public generateHeaders(
        {
            method,
            endpoint,
            query,
            body,
        }: KuReq[0]['forSignature'] & { endpoint: Endpoint },
        keys: Record<typeof KU_ENV_KEYS[number], string> | NodeJS.ProcessEnv,
    ) {
        const {
            API_KEY,
            API_PASSPHRASE,
            API_SECRET,
        } = keys as any;
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
        } as const;
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

        return `${timestamp}${method}${endpoint}${_body}`;
    }

    private signature(payload: string, apiSecret: string) {
        const hmac = nodeForge.hmac.create();

        hmac.start('sha256', apiSecret);
        hmac.update(payload);

        return nodeForge.util.encode64(hmac.digest().bytes());
    }
}

