import { qsFromObj } from '@hft-forge/utils';
import { request } from 'undici';
import { WebSocket } from 'ws';
import { KuReq, KuRes } from '@hft-forge/types/ku/http';
import { KuSignGeneratorService_copypast } from '../../copy-past/ku-sign-generator-service.copy-paster';


export async function privateConnectToKuWs(id = (() => Date.now().toString())()) {
    const { url, forSignature }: KuReq<'/api/v1/bullet-private'>[0] = {
        url: 'https://api.kucoin.com/api/v1/bullet-private',
        forSignature: {
            endpoint: '/api/v1/bullet-private',
            method: 'POST',
        },
    };
    const headers = new KuSignGeneratorService_copypast().generateHeaders(forSignature, process.env);
    const payload: KuReq<'/api/v1/bullet-private'>[1] = {
        headers,
        method: 'POST',
    };
    const { body } = await request(url, payload);
    const { data } = await body.json() as KuRes<'/api/v1/bullet-private'>;
    const { instanceServers: [{ endpoint }], token } = data;
    const ws = new WebSocket(`${endpoint}?${qsFromObj({ token, id })}`);

    return new Promise<WebSocket>((resolve, reject) => {
        ws.once('open', () => resolve(ws));
        ws.once('error', reject);
    });
}
