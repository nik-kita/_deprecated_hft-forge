import { KuReq_apply_private_connect_token, KuRes_apply_connect_token, KU_BASE_URL } from '@hft-forge/types/ku';
import { qsFromObj } from '@hft-forge/utils';
import { request } from 'undici';
import { WebSocket } from 'ws';
import { KuSignGeneratorService_copypast } from '../../copy-past/ku-sign-generator-service.copy-paster';


export async function privateConnectToKuWs(id = (() => Date.now().toString())()) {
    const payload: KuReq_apply_private_connect_token = {
        endpoint: '/api/v1/bullet-private',
        method: 'POST',
    };
    const headers = new KuSignGeneratorService_copypast().generateHeaders({
        endpoint: payload.endpoint,
        method: payload.method,
    }, process.env as any);
    const { body } = await request(`${KU_BASE_URL}${payload.endpoint}`, {
        method: payload.method,
        headers,
    });
    const { data } = await body.json() as KuRes_apply_connect_token;
    const { instanceServers: [{ endpoint }], token } = data;
    const ws = new WebSocket(`${endpoint}?${qsFromObj({ token, id })}`);

    return new Promise<WebSocket>((resolve, reject) => {
        ws.once('open', () => resolve(ws));
        ws.once('error', reject);
    });
}
