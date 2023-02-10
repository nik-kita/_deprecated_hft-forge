import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppGate } from '../app/app.gate';


describe(AppGate.name, () => {
    let app: TestingModule;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            providers: [AppGate],
        }).compile();
    });

    it('Should connect/disconnect to gate', () => {
        const appGate = app.get<AppGate>(AppGate);
        const spyLogger = jest.spyOn((appGate as any).logger as Logger, 'debug');
        const pseudoClient = {} as any;

        appGate.handleConnection(pseudoClient);
        appGate.handleDisconnect(pseudoClient);

        expect(spyLogger).toBeCalledTimes(2);

        const calledNames = spyLogger
            .mock
            .calls
            .map(([str]: [string, ...any[]]) => str.substring(2));

        expect(calledNames[0]).toBe(calledNames[1]);
    });
});
