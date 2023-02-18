import { KU_POST_ENDPOINT } from '../../const';
import { KuReq } from '../common/ku-req.type';

export type KuReq_apply_public_connect_token = KuReq<
    'POST',
    typeof KU_POST_ENDPOINT['apply_ws_connect_token']['public']
>;


export type KuReq_apply_private_connect_token = KuReq<
    'POST',
    typeof KU_POST_ENDPOINT['apply_ws_connect_token']['private']
>;

export type KuRes_apply_connect_token = {
    code: "200000",
    data: {
        token: string,
        instanceServers: {
                endpoint: "wss://ws-api-spot.kucoin.com/",
                encrypt: true,
                protocol: "websocket",
                pingInterval: number,
                pingTimeout: number,
            }[],
    }
}
