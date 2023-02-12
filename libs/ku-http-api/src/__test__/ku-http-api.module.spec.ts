import { Test, TestingModule } from '@nestjs/testing';
import { KuHttpApiModule, KuSignGeneratorService } from '..';


describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
        imports: [KuHttpApiModule],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Welcome to app!"', () => {
      const kuSignGeneratorService = app.get<KuSignGeneratorService>(KuSignGeneratorService);

      expect(kuSignGeneratorService).toBeDefined();
    });
  });
});
