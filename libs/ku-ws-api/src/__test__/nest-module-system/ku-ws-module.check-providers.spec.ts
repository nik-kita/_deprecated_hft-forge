import { HttpService } from '@hft-forge/http';
import { WsClientService } from '@hft-forge/ws';
import { Test, TestingModule } from '@nestjs/testing';
import { KuWsApiModule } from '../..';


describe('Check all members of /KuWsApiModule/ after its import', () => {
    let app: TestingModule;

    beforeEach(async () => {
        app = await Test.createTestingModule({
            imports: [KuWsApiModule],
        }).compile();
    });

    afterEach(async () => {
        await app?.close();
    });

    it(`${HttpService.name} and ${WsClientService.name || 'WsClientService'} should be mounted`, () => {
        const kuWsApiModule = app.get(KuWsApiModule);

        expect(kuWsApiModule).toBeInstanceOf(KuWsApiModule);

        const httpService = app.get(HttpService);

        expect(httpService).toBeInstanceOf(HttpService);

        const wsClient = app.get(WsClientService);

        expect(wsClient).toBeInstanceOf(WsClientService);
    });
});

