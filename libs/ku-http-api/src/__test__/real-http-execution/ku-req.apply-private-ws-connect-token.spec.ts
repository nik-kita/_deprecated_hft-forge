import { HttpService } from '@hft-forge/http';
import { itif } from '@hft-forge/test-pal/core';
import { KU_ENV_KEYS } from '@hft-forge/types/ku/common';
import { KuReq } from '@hft-forge/types/ku/http';
import { KuSignGeneratorService } from '../../lib/ku-http-api.sign-generator.service';


describe('Check Kucoin http request to apply connect token for private ws channels', () => {
    let httpClient: HttpService;
    let signGenerator: KuSignGeneratorService;


    beforeEach(() => {
        httpClient = new HttpService();
        signGenerator = new KuSignGeneratorService();
    });

    itif({
        needEnv: {
            envFilePath: '.test.env',
            envVariables: KU_ENV_KEYS,
        },
    })('Should receive token', async () => {
        const { forSignature, url }: KuReq<'/api/v1/bullet-private'>[0] = {
            url: 'https://api.kucoin.com/api/v1/bullet-private',
            forSignature: {
                endpoint: '/api/v1/bullet-private',
                method: 'POST',
            },
        };
        const headers = signGenerator.generateHeaders(forSignature, process.env);
        const payload: KuReq<'/api/v1/bullet-private'>[1] = {
            headers,
            method: 'POST',
        };
        const { statusCode } = await httpClient.req(url, payload);

        expect(statusCode).toBeLessThan(400);
    });
});
