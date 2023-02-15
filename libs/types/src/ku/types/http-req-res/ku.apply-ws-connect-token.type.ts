import { KU_POST_ENDPOINT } from '../../const';
import { KuReq } from '../common/ku-req.type';

export type KuReq_apply_ws_public_connect_token = KuReq<
    'POST',
    typeof KU_POST_ENDPOINT['apply_ws_connect_token']['public']
>;
