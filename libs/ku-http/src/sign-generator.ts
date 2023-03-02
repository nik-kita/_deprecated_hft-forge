import { Endpoint, KuReq, KuEnvKeys } from '@project/types/ku';
import { qsFromObj } from '@project/utils';
import * as nodeForge from 'node-forge';


export class SignGenerator {
    public generateHeaders(
        {
            method,
            endpoint,
            query,
            body,
        }: KuReq[0]['forSignature'] & { endpoint: Endpoint },
        keys: Record<KuEnvKeys, string> | NodeJS.ProcessEnv,
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
        method: 'POST' | 'GET' | 'DELETE',
        body?: object | string,
    ) {
        let _body: string | object = body ?? '';

        if (Object(body) === body) {
            _body = JSON.stringify(body);
        }

        return `${timestamp}${method}${endpoint}${_body}`;
    }

    private signature(payload: string, apiSecret: string): string {
        const hmac = nodeForge.hmac.create();

        hmac.start('sha256', apiSecret);
        hmac.update(payload);

        return nodeForge.util.encode64(hmac.digest().bytes());
    }
}

