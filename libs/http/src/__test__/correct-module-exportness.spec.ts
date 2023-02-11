import { Injectable, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { request } from 'undici';
import { HttpModule, HttpService } from '..';


describe(`${HttpModule.name}, ${HttpService.name}`, () => {
    it.each([HttpModule, HttpService])('%p should be defined', (cl) => {
        expect(cl).toBeDefined();
        expect(cl).toBeInstanceOf(Function);
    });

    it(`${HttpModule.name} should be imported and export ${HttpService.name}`, async () => {
        @Injectable()
        class TestService {
            constructor(public http: HttpService) {}
        }

        @Module({
            imports: [HttpModule],
            providers: [TestService],
        })
        class TestApp { }

        try {
            const testApp = await NestFactory.create(TestApp, { logger: false });

            
            
            const actual = testApp.get<HttpService>(HttpService);
            
            expect(actual).toBeInstanceOf(HttpService);
            expect(actual.req.toString()).toBe(request.toString());
            
            const testService = testApp.get<TestService>(TestService);
            
            expect(testService).toBeInstanceOf(TestService);
            expect(testService.http.req.toString()).toBe(request.toString());
            
            await testApp.listen(0);
            await testApp.close();
        } catch (error) {
            console.error(error);

            expect('not').toBe('here!');
        }
    });
});
