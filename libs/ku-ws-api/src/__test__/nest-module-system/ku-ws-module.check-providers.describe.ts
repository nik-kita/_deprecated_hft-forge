import { HttpService } from '@hft-forge/http';
import { WsClientService } from '@hft-forge/ws';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { KuWsApiModule } from '../../lib/ku-ws-api.module';



export const describe_ku_ws_module_providers_check = (
    name: 'Check all members of /KuWsApiModule/ after its import',
    getData: () => ({
        testApp: TestingModule,
    }),
) => {
    return describe(name, () => {
        let testingModule: TestingModule;


        beforeEach(() => {
            const data = getData();

            testingModule = data.testApp;
        });

        it(`/${HttpService.name}/ and /${WsClientService.name} should be mounted`, () => {
            const kuWsApiModule = testingModule.get(KuWsApiModule);

            expect(kuWsApiModule).toBeInstanceOf(KuWsApiModule);

            const httpService = testingModule.get(HttpService);

            expect(httpService).toBeInstanceOf(HttpService);

            const wsClient = testingModule.get(WsClientService);

            expect(wsClient).toBeInstanceOf(WsClientService);
        });
    });
};
