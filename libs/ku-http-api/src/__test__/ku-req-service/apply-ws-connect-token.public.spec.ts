import { HttpService } from '@hft-forge/http';
import { genMockConfigModule } from '@hft-forge/test-pal/mocks';
import { KU_ENV_KEYS } from '@hft-forge/types/ku/common';
import { KuReq } from '@hft-forge/types/ku/http';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { request } from 'undici';
import { KuReqService } from '../../lib/ku-http-api.ku-req.service';
import { KuHttpApiModule } from '../../lib/ku-http-api.module';
import { fixture_KuRes_apply_ws_public_connect_token } from './fixtures';


describe('KuReqService.postApplyWsConnectToken() /public/', () => {
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

        httpService.req = jest.fn(async (
            url: string,
            options: Parameters<typeof request>[1],
        ) => {
            wasHere = already;

            const expectedUrl: KuReq<'/api/v1/bullet-public'>[0]['url'] = 'https://api.kucoin.com/api/v1/bullet-public';

            expect(url).toBe(expectedUrl);
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
