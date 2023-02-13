import { KU_ENV_KEYS } from '@hft-forge/types/ku';
import { itif } from '@hft-forge/utils';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { join } from 'path';
import { KuHttpApiModule, KuReqService, KuSignGeneratorService } from '..';


describe(`${KuReqService.name} (if it possible - test real http execution)`, () => {
    itif({
        needEnv: {
            envFilePath: '.test.env',
            envVariables: KU_ENV_KEYS.map((k) => k),
        },
    })('Should get full order book', async () => {
        const app = await Test.createTestingModule({
            imports: [KuHttpApiModule, ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: [join(process.cwd(), '.test.env')],
            })],
        }).compile();

        const sGen = app.get<KuSignGeneratorService>(KuSignGeneratorService);

        expect(sGen).toBeInstanceOf(KuSignGeneratorService);

        const kuReq = app.get<KuReqService>(KuReqService);

        expect(kuReq).toBeInstanceOf(KuReqService);
        expect((kuReq as any).signGeneratorService).toBeInstanceOf(KuSignGeneratorService);

        const { body, statusCode } = await kuReq.get().order_book.full('BTC-USDT');

        expect(statusCode).toBeLessThan(400);
        expect(body).toBeDefined();
    });
});
