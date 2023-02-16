import { describe, expect, it } from '@jest/globals';
import { Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
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
        });
    });
};
