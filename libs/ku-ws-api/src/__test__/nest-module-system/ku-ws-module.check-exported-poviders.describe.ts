import { WsClientService } from '@hft-forge/ws';
import { describe, expect, it } from '@jest/globals';
import { Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { HttpService } from '@hft-forge/http';
import { KuWsApiModule } from '../../lib/ku-ws-api.module';
import { KuWsApiService } from '../../lib/ku-ws-api.service';



export const describe_ku_ws_module_exported_providers_check = (
    name: 'Check exports of /KuWsApiModule/',
    getData: () => {/**/},
) => {
    return describe(name, () => {
        @Module({
            imports: [KuWsApiModule],
        })
        class ClientModule {}

        it(`${KuWsApiService.name} should be imported by "client" module`, async () => {
            const clientApp = await Test.createTestingModule({
                imports: [ClientModule],
            }).compile();

            const kuWsApiService = clientApp.get(KuWsApiService);

            expect(kuWsApiService).toBeInstanceOf(KuWsApiService);

            await clientApp?.close();
        });

        it(`${KuWsApiService.name} should contain /wsClient/ property ${WsClientService.name}`, async () => {
            const clientApp = await Test.createTestingModule({
                imports: [ClientModule],
            }).compile();

            const kuWsApiService = clientApp.get(KuWsApiService);

            expect(kuWsApiService).toBeInstanceOf(KuWsApiService);
            expect((kuWsApiService as any)['wsClient']).toBeInstanceOf(WsClientService);

            await clientApp?.close();
        });

        it(`${KuWsApiService.name} should contain /httpClient/ property ${HttpService.name}`, async () => {
            const clientApp = await Test.createTestingModule({
                imports: [ClientModule],
            }).compile();

            const httpService = clientApp.get(HttpService);

            expect(httpService).toBeInstanceOf(HttpService);

            const kuWsApiService = clientApp.get(KuWsApiService);

            expect((kuWsApiService as any)['httpClient']).toBeInstanceOf(HttpService);

            await clientApp?.close();
        });
    });
};
