import { HttpService } from '@hft-forge/http';
import { genMockConfigModule } from '@hft-forge/test-pal/mocks';
import { KU_ENV_KEYS } from '@hft-forge/types/ku/common';
import { KuReq } from '@hft-forge/types/ku/http';
import { Test, TestingModule } from '@nestjs/testing';
import * as jesst from 'jest-mock';
import { request } from 'undici';
import { KuReqService } from '../../lib/ku-http-api.ku-req.service';
import { KuHttpApiModule } from '../../lib/ku-http-api.module';
import { fixture_KuRes_order_book_level_2_full } from './fixtures';




describe('KuReqService.getFullOrderBook()', () => {
    let mockApp: TestingModule;
    let kuReqService: KuReqService;
    let httpService: HttpService;

    beforeEach(async () => {
        mockApp = await Test.createTestingModule({
            imports: [
                genMockConfigModule(KU_ENV_KEYS),
                KuHttpApiModule,
            ],
        }).compile();

        kuReqService = mockApp.get(KuReqService);
        httpService = mockApp.get(HttpService);
    });


    it('Should return correct response', async () => {
        const already = 'already';
        let wasHere = 'where?';

        httpService.req = jesst.fn(async (
            url: string,
            options: Parameters<typeof request>[1],
        ) => {
            wasHere = already;

            const expectedUrl: KuReq<'/api/v3/market/orderbook/level2'>[0]['url'] = 'https://api.kucoin.com/api/v3/market/orderbook/level2';

            expect(url).toBe(expectedUrl);
            expect(options?.method).toBe('GET');
            expect(Object.keys(options?.query || {})).toContain('symbol');

            const mockResult = fixture_KuRes_order_book_level_2_full;

            return Promise.resolve({
                body: {
                    json: () => Promise.resolve(mockResult),
                },
            }) as any;
        });

        const res = await kuReqService
            .get()
            .order_book
            .full('BTC-USDT');

        expect(already).toBe(wasHere);
        expect(res?.body?.json).toBeInstanceOf(Function);

        const data = await res.body.json();

        expect(data).toBeDefined();
        expect(data).toEqual(fixture_KuRes_order_book_level_2_full);
    });
});

