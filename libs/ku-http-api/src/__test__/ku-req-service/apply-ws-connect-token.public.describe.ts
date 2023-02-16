import { HttpService } from '@hft-forge/http';
import { KU_BASE_URL, KU_POST_ENDPOINT } from '@hft-forge/types/ku';
import { beforeEach, describe, expect, it } from '@jest/globals';
import * as jesst from 'jest-mock';
import { request } from 'undici';
import { KuReqService } from '../../lib/ku-http-api.ku-req.service';
import { fixture_KuRes_apply_ws_public_connect_token } from './fixtures';



export const describe_ku_req_apply_public_ws_token = (
    name: 'KuReqService.postApplyWsConnectToken() /public/',
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

                expect(url).toBe(`${KU_BASE_URL}${KU_POST_ENDPOINT.apply_ws_connect_token.public}`);
                expect(options?.method).toBe('POST');
                expect(Object.keys(options?.query || {}).length).toBe(0);

                const mockResult = fixture_KuRes_apply_ws_public_connect_token;

                return Promise.resolve({
                    body: {
                        json: () => Promise.resolve(mockResult),
                    },
                }) as any;
            });

            const res = await kuReqService
                .post()
                .apply_ws_connect_token
                .public();
 
            
            expect(already).toBe(wasHere);
            expect(res?.body?.json).toBeInstanceOf(Function);

            const data = await res.body.json();

            expect(data).toBeDefined();
            expect(data).toEqual(fixture_KuRes_apply_ws_public_connect_token);
        });
    });
};
