import { HttpService } from '@hft-forge/http';
import { KU_ENV_KEYS } from '@hft-forge/types/ku';
import { describePortal, genMockConfigModule } from '@hft-forge/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { KuReqService } from '../../lib/ku-http-api.ku-req.service';
import { KuHttpApiModule } from '../../lib/ku-http-api.module';
import { describe_ku_req_apply_public_ws_token } from './apply-ws-connect-token.public.describe';
import { describe_ku_req_full_order_book } from './order-book-level-2.full.describe';

describe(KuReqService.name, () => {
    let mockApp: TestingModule;
    let kuReqService: KuReqService;
    let httpService: HttpService;

    beforeEach(async () => {
        const mockApp = await Test.createTestingModule({
            imports: [
                genMockConfigModule(KU_ENV_KEYS.map((k) => k)),
                KuHttpApiModule,
            ],
        }).compile();

        kuReqService = mockApp.get(KuReqService);
        httpService = mockApp.get(HttpService);
    });

    describePortal(
        describe_ku_req_full_order_book,
        'KuReqService.getFullOrderBook()',
        () => ({ httpService, kuReqService }),
    );

    describePortal(
        describe_ku_req_apply_public_ws_token,
        'KuReqService.postApplyWsConnectToken() /public/',
        () => ({ httpService, kuReqService }),
    );

    afterEach(async () => {
        await mockApp?.close();
    });
});
