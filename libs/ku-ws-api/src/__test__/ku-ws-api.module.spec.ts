import { Test, TestingModule } from '@nestjs/testing';
import { KuWsApiModule } from '..';


describe(KuWsApiModule.name, () => {
    let app: TestingModule;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            imports: [KuWsApiModule],
        }).compile();
    });

    it(`${KuWsApiModule.name} should be defined`, () => {
        expect(app.get(KuWsApiModule)).toBeInstanceOf(KuWsApiModule);
    });
});
