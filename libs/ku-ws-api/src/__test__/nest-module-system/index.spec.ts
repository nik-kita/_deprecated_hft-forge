import { describePortal } from '@hft-forge/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { KuWsApiModule } from '../..';
import { describe_ku_ws_module_providers_check } from './ku-ws-module.check-providers.describe';


describe(KuWsApiModule.name, () => {
    let app: TestingModule;

    beforeEach(async () => {
        app = await Test.createTestingModule({
            imports: [KuWsApiModule],
        }).compile();
    });

    describePortal(
        describe_ku_ws_module_providers_check,
        'Check all members of /KuWsApiModule/ after its import',
        () => ({ testApp: app }),
    );

    afterEach(async () => {
        await app?.close();
    });
});
