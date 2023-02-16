import { Test, TestingModule } from '@nestjs/testing';
import { WsClientModule } from '..';


describe(WsClientModule.name, () => {
    let app: TestingModule;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            imports: [WsClientModule],
        }).compile();
    });

    it(`${WsClientModule.name} should be defined`, () => {
        expect(app.get(WsClientModule)).toBeInstanceOf(WsClientModule);
    });
});
