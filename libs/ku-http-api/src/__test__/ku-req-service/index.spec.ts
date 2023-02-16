import { HttpService } from '@hft-forge/http';
import { describePortal, genMockConfigModule } from '@hft-forge/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { KU_ENV_KEYS } from '@hft-forge/types/ku';
import { KuReqService } from '../../lib/ku-http-api.ku-req.service';
import { KuHttpApiModule } from '../../lib/ku-http-api.module';
import { describe_ku_req_full_order_book } from './ku-http-api.ku-req.full-order-book.describe';

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

    afterEach(async () => {
        await mockApp?.close();
    });
});
