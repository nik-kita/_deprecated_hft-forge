import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { KuHttpApiModule, KuSignGeneratorService } from '..';
import { KuReq } from '../lib/ku-http-api.ku-req.service';


describe(KuHttpApiModule.name, () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
        imports: [KuHttpApiModule, ConfigModule.forRoot({ isGlobal: true })],
    }).compile();
  });

    it('Should import/export all providers', () => {
      const kuSignGeneratorService = app.get<KuSignGeneratorService>(KuSignGeneratorService);
      const kuReq = app.get<KuReq>(KuReq);
      
      expect(kuSignGeneratorService).toBeDefined();
      expect(kuSignGeneratorService).toBeInstanceOf(KuSignGeneratorService);
      expect(kuReq).toBeDefined();
  });

});
