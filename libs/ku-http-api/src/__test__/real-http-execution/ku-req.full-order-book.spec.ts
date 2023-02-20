import { itif } from '@hft-forge/test-pal/core';
import { KU_ENV_KEYS } from '@hft-forge/types/ku/common';
import { KuReq } from '@hft-forge/types/ku/http';
import { request } from 'undici';
import { KuSignGeneratorService } from '../..';


describe(`Check LEVEL_2 endpoint`, () => {
    itif({
        needEnv: {
            envFilePath: '.test.env',
            envVariables: KU_ENV_KEYS,
        },
    })('Should get full order book', async () => {
        const { forSignature, url }: KuReq<'/api/v1/bullet-private'>[0] = {
            url: 'https://api.kucoin.com/api/v1/bullet-private',
            forSignature: {
                endpoint: '/api/v1/bullet-private',
                method: 'POST',
            },
        };
        const headers = new KuSignGeneratorService().generateHeaders(forSignature, process.env);
        const payload: KuReq<'/api/v1/bullet-private'>[1] = {
            headers,
            method: 'POST',
        };
        const res = await request(url, payload);

        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.json).toBeInstanceOf(Function);

        const jData = await res.body.json();

        expect(jData).toBeInstanceOf(Object);
        expect(res.statusCode).toBeLessThan(400);

        // writeFileSync(
        //     join(__dirname, '../ku-req-service', 'full-order-book-response.example.json'),
        //     JSON.stringify(jData, null, 4),
        //     { encoding: 'utf-8'},
        // );
    }, 10_000);
});

