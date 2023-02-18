import { HttpService } from '@hft-forge/http';
import { KuReq_apply_private_connect_token, KU_BASE_URL, KU_ENV_KEYS } from '@hft-forge/types/ku';
import { itif } from '@hft-forge/utils';
import { beforeEach, describe, expect } from '@jest/globals';
import { KuSignGeneratorService } from '../../lib/ku-http-api.sign-generator.service';


export function describe_ku_req_apply_private_ws_connect_token(
    name: 'Check Kucoin http request to apply connect token for private ws channels',
) {

    return describe(name, () => {
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
}
