import { HttpService } from '@hft-forge/http';
import { itif } from '@hft-forge/test-pal/core';
import { KuReq_apply_private_connect_token, KU_BASE_URL, KU_ENV_KEYS } from '@hft-forge/types/ku';
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
            envVariables: KU_ENV_KEYS.map((k) => k),
        },
    })('Should receive token', async () => {
        const payload: KuReq_apply_private_connect_token = {
            endpoint: '/api/v1/bullet-private',
            method: 'POST',
        };
        const headers = signGenerator.generateHeaders(payload, process.env as any);
        const { statusCode } = await httpClient.req(`${KU_BASE_URL}${payload.endpoint}`, {
            method: payload.method,
            headers,
        });

        expect(statusCode).toBeLessThan(400);
    });
});
