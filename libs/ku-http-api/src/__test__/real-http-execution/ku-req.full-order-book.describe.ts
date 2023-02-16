import { KuReq_order_book_level_2_full, KU_BASE_URL, KU_ENV_KEYS, KU_GET_ENDPOINT } from '@hft-forge/types/ku';
import { itif } from '@hft-forge/utils';
import { describe, expect } from '@jest/globals';
import { request } from 'undici';
import { KuSignGeneratorService } from '../..';


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
            const keys = {
                API_KEY: process.env.API_KEY!,
                API_SECRET: process.env.API_SECRET!,
                API_PASSPHRASE: process.env.API_PASSPHRASE!,
            };
            const payload: KuReq_order_book_level_2_full = {
                endpoint: KU_GET_ENDPOINT.order_book.full,
                method: 'GET',
                query: { symbol: 'BTC-USDT' },
            };
            const kuReqSignService = new KuSignGeneratorService();
            const headers = kuReqSignService.generateHeaders(payload, keys);
            const { endpoint, ...options } = { ...payload, headers };
            const res = await request(`${KU_BASE_URL}${endpoint}`, options);

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
};
