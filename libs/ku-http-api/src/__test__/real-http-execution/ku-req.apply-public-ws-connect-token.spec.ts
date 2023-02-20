import { itif } from '@hft-forge/test-pal/core';
import { KuReq } from '@hft-forge/types/ku/http';
import { request } from 'undici';


describe(`Check PUBLIC_APPLY_CONNECT endpoint`, () => {
    itif({ customCondition: true })('Should get "apply token" for public ws chanel', async () => {
        const { url }: KuReq<'/api/v1/bullet-public'>[0] = { url: 'https://api.kucoin.com/api/v1/bullet-public' };
        const payload: KuReq<'/api/v1/bullet-public'>[1] = {
            method: 'POST',
        };
        const res = await request(url, payload);

        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.json).toBeInstanceOf(Function);

        const jData = await res.body.json();

        expect(jData).toBeInstanceOf(Object);
    });
});

