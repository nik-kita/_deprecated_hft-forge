import { KuReqService } from '@hft-forge/ku-http-api';
import { WsClientService } from '@hft-forge/ws';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { KuWsApiModule } from '../..';


describe('Check all members of /KuWsApiModule/ after its import', () => {
    let app: TestingModule;

    beforeEach(async () => {
        app = await Test.createTestingModule({
            imports: [KuWsApiModule, ConfigModule.forRoot({ isGlobal: true })],
        }).compile();
    });

    afterEach(async () => {
        await app?.close();
    });

    it('HttpService and WsClientService should be mounted', () => {
        const kuWsApiModule = app.get(KuWsApiModule);

        expect(kuWsApiModule).toBeInstanceOf(KuWsApiModule);

        const httpService = app.get(KuReqService);

        expect(httpService).toBeInstanceOf(KuReqService);

        const wsClient = app.get(WsClientService);

        expect(wsClient).toBeInstanceOf(WsClientService);
    });
});

