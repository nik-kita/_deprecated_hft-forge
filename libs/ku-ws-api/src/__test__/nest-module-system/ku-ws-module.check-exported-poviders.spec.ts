import { KuReqService } from '@hft-forge/ku-http-api';
import { WsClientService } from '@hft-forge/ws';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { KuWsApiModule, KuWsApiService } from '../..';



describe('Check exports of /KuWsApiModule/', () => {

    @Module({
        imports: [KuWsApiModule, ConfigModule.forRoot({ isGlobal: true })],
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

    it('KuWsApiService should contain /kuReq/ property KuReqService', async () => {
        const clientApp = await Test.createTestingModule({
            imports: [ClientModule],
        }).compile();

        const httpService = clientApp.get(KuReqService);

        expect(httpService).toBeInstanceOf(KuReqService);

        const kuWsApiService = clientApp.get(KuWsApiService);

        expect((kuWsApiService as any)['kuReq']).toBeInstanceOf(KuReqService);

        await clientApp?.close();
    });
});

