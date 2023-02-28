import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { KuHttpApiModule, KuSignGeneratorService } from '..';
import { KuReqService } from '../lib/ku-http-api.ku-req.service';


describe(KuHttpApiModule.name, () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
        imports: [KuHttpApiModule, ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.test.env'] })],
    }).compile();
  });

    it('Should import/export all providers', () => {
      const kuSignGeneratorService = app.get<KuSignGeneratorService>(KuSignGeneratorService);
      const kuReq = app.get<KuReqService>(KuReqService);
      
      expect(kuSignGeneratorService).toBeDefined();
      expect(kuSignGeneratorService).toBeInstanceOf(KuSignGeneratorService);
      expect(kuReq).toBeDefined();
  });
});
