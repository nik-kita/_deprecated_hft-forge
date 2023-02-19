import { KuReq_apply_public_connect_token, KuRes_apply_connect_token, KU_BASE_URL } from '@hft-forge/types/ku';
import { qsFromObj } from '@hft-forge/utils';
import { request } from 'undici';
import { WebSocket } from 'ws';


export async function publicConnectToKuWs(id = (() => Date.now().toString())()) {
    const payload: KuReq_apply_public_connect_token = {
        endpoint: '/api/v1/bullet-public',
        method: 'POST',
    };
    const { body } = await request(`${KU_BASE_URL}${payload.endpoint}`, {
        method: payload.method,
    });
    const { data } = await body.json() as KuRes_apply_connect_token;
    const { instanceServers: [{ endpoint }], token } = data;
    const ws = new WebSocket(`${endpoint}?${qsFromObj({ token, id })}`);

    return new Promise<WebSocket>((resolve, reject) => {
        ws.once('open', () => resolve(ws));
        ws.once('error', reject);
    });
}
