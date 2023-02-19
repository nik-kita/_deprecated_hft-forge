import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { genMockConfigModule } from '..';


describe(genMockConfigModule.name, () => {
    it('Should load mock process.env with provided keys and values as keys', async () => {
        @Module({
            imports: [genMockConfigModule(['HELLO', 'WORLD'])],
        })
        class TestApp {}

        const testApp = await Test.createTestingModule({
            imports: [TestApp],
        }).compile();
        const configService = testApp.get(ConfigService);

        const actualHello = configService.get('HELLO');

        expect(actualHello).toBeDefined();
        expect(actualHello).toBe('HELLO');

        const actualWorld = configService.get('WORLD');
        
        expect(actualWorld).toBeDefined();
        expect(actualWorld).toBe('WORLD');

        await testApp?.close();
    });
});
