import { HttpService } from '@hft-forge/http';
import { KU_BASE_URL, KU_GET_ENDPOINT } from '@hft-forge/types/ku';
import { beforeEach, describe, expect, it } from '@jest/globals';
import * as jesst from 'jest-mock';
import { request } from 'undici';
import { KuReqService } from '../../lib/ku-http-api.ku-req.service';
import { fixture_KuRes_order_book_level_2_full } from './fixtures';



export const describe_ku_req_full_order_book = (
    name: 'KuReqService.getFullOrderBook()',
    getMocks: () => ({ kuReqService: KuReqService, httpService: HttpService }),
) => {
    return describe(name, () => {
        let kuReqService: KuReqService;
        let httpService: HttpService;

        beforeEach(() => {
            kuReqService = getMocks().kuReqService;
            httpService = getMocks().httpService;
        });

        it('Should return correct response', async () => {
            const already = 'already';
            let wasHere ='where?';

            httpService.req = jesst.fn(async (
                url: string,
                options: Parameters<typeof request>[1],
            ) => {
                wasHere = already;

                expect(url).toBe(`${KU_BASE_URL}${KU_GET_ENDPOINT.order_book.full}`);
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
};
