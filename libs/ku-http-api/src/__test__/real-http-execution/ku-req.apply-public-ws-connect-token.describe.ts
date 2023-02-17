import { KuReq_apply_public_connect_token, KU_BASE_URL, KU_POST_ENDPOINT } from '@hft-forge/types/ku';
import { itif } from '@hft-forge/utils';
import { describe, expect } from '@jest/globals';
import { request } from 'undici';


export const describe_apply_public_ws_connect_token = (
    name: `Check ${typeof KU_POST_ENDPOINT.apply_ws_connect_token.public} endpoint`,
    getMocks: () => unknown,
) => {

    return describe(name, () => {
        itif({ customCondition: true })('Should get "apply token" for public ws chanel', async () => {
            const payload: KuReq_apply_public_connect_token = {
                endpoint: KU_POST_ENDPOINT.apply_ws_connect_token.public,
                method: 'POST',
            };
            const { endpoint, ...options } = payload;
            const res = await request(`${KU_BASE_URL}${endpoint}`, options);

            expect(res).toBeDefined();
            expect(res.body).toBeDefined();
            expect(res.body.json).toBeInstanceOf(Function);

            const jData = await res.body.json();

            expect(jData).toBeInstanceOf(Object);
        });
    });
};
