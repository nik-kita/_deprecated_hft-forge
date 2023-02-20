import { HttpService } from '@hft-forge/http';
import { WsClientService } from '@hft-forge/ws';
import { Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { KuWsApiModule, KuWsApiService } from '../..';



describe('Check exports of /KuWsApiModule/', () => {

    @Module({
        imports: [KuWsApiModule],
    })
    class ClientModule { }

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

