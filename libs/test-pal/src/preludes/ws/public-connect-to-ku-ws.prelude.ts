import { KuReq, KuRes } from '@hft-forge/types/ku/http';
import { qsFromObj } from '@hft-forge/utils';
import { request } from 'undici';
import { WebSocket } from 'ws';


export async function publicConnectToKuWs(id = (() => Date.now().toString())()) {
    const { url }: KuReq<'/api/v1/bullet-public'>[0] = {
        url: 'https://api.kucoin.com/api/v1/bullet-public',
    };
    const payload: KuReq<'/api/v1/bullet-public'>[1] = {
        method: 'POST',
    };
    const { body } = await request(url, payload);
    const { data } = await body.json() as KuRes<'/api/v1/bullet-public'>;
    const { instanceServers: [{ endpoint }], token } = data;
    const ws = new WebSocket(`${endpoint}?${qsFromObj({ token, id })}`);

    return new Promise<WebSocket>((resolve, reject) => {
        ws.once('open', () => resolve(ws));
        ws.once('error', reject);
    });
}
