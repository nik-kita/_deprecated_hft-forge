import { actionSetMonitor } from '@hft-forge/forge-store';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { WebSocket } from 'ws';
import { AppGate } from '../app/app.gate';
import { ForgeStoreService } from '../app/services/forge-store.service';


describe(AppGate.name, () => {
    let app: TestingModule;
    let appGate: AppGate;
    let spyLogger: jest.SpyInstance;
    let pseudoClient: any;
    let forgeStoreService: ForgeStoreService;

    beforeEach(async () => {
        app = await Test.createTestingModule({
            providers: [AppGate, ForgeStoreService],
        }).compile();
        appGate = app.get<AppGate>(AppGate);
        forgeStoreService = app.get<ForgeStoreService>(ForgeStoreService);
        spyLogger = jest.spyOn<Logger, 'debug'>((appGate as any).logger as Logger, 'debug');
        pseudoClient = {
            readyState: WebSocket.OPEN,
            send: jest.fn(),
        } as unknown as WebSocket;
    });

    it('Should connect/disconnect to gate', () => {
        appGate.handleConnection(pseudoClient);
        appGate.handleDisconnect(pseudoClient);

        expect(spyLogger).toBeCalledTimes(2);

        const calledNames = spyLogger
            .mock
            .calls
            .map(([str]: [string, ...any[]]) => str.substring(2));

        expect(calledNames[0]).toBe(calledNames[1]);
    });

    it('Should subscribe on "forgeState"', async () => {
        const spyForgeStore_private_subscribers = (forgeStoreService as any).subscribers as Map<string, WebSocket>;

        expect(spyForgeStore_private_subscribers.size).toBe(0);

        appGate.handleConnection(pseudoClient);
        appGate.forgeState(pseudoClient);

        expect(spyForgeStore_private_subscribers.size).toBe(1);

        forgeStoreService.dispatch(actionSetMonitor({
            have: 'TEST',
            want: 'SUCCESS',
            currency_pair: 'TEST/SUCCESS',
        }));

        expect(pseudoClient.send).toBeCalledTimes(2);
        
        appGate.handleDisconnect(pseudoClient);
        
        expect(spyForgeStore_private_subscribers.size).toBe(0);

        forgeStoreService.dispatch(actionSetMonitor());

        expect(pseudoClient.send).toBeCalledTimes(2);
    });
});
