import { KU_ENV_KEYS, KU_GET_ENDPOINT } from '@hft-forge/types/ku';
import { itif } from '@hft-forge/utils';
import { describe, expect } from '@jest/globals';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { join } from 'path';
import { KuHttpApiModule, KuReqService, KuSignGeneratorService } from '../..';


export const describe_full_order_book_request = (
    name: `Check ${typeof KU_GET_ENDPOINT.order_book.full} endpoint`,
    getMocks: () => unknown,
) => {

    return describe(name, () => {
        itif({
            needEnv: {
                envFilePath: '.test.env',
                envVariables: KU_ENV_KEYS.map((k) => k),
            },
        })('Should get full order book', async () => {
            const app = await Test.createTestingModule({
                imports: [KuHttpApiModule, ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: [join(process.cwd(), '.test.env')],
                })],
            }).compile();

            const sGen = app.get<KuSignGeneratorService>(KuSignGeneratorService);

            expect(sGen).toBeInstanceOf(KuSignGeneratorService);

            const kuReq = app.get<KuReqService>(KuReqService);

            expect(kuReq).toBeInstanceOf(KuReqService);
            expect((kuReq as any).signGeneratorService).toBeInstanceOf(KuSignGeneratorService);

            const { body, statusCode, context, headers } = await kuReq.get().order_book.full('BTC-USDT');

            if (statusCode >= 400) {
                console.warn(context);
                console.warn(headers);
                console.warn(await body.json());
            }

            expect(statusCode).toBeLessThan(400);
        });
    });
};
