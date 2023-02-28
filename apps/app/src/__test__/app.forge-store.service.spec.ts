import { Test, TestingModule } from '@nestjs/testing';
import { actionSetMonitor } from '@hft-forge/forge-store';
import { ForgeStoreService } from '../app/services/forge-store.service';
import { WebSocket } from 'ws';
import { IMonitor } from '@hft-forge/types/forge-store';
import { AppGateEvent } from '@hft-forge/types/app';


const genMockWs = () => {
    return {
        readyState: WebSocket.OPEN,
        send: jest.fn(),
    } as unknown as WebSocket;
};


describe(ForgeStoreService.name, () => {
    let app: TestingModule;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            providers: [ForgeStoreService],
        }).compile();
    });

    it('Should notify all subscribers about store changes', () => {
        const event: AppGateEvent = 'forgeState';
        const forgeStoreService = app.get<ForgeStoreService>(ForgeStoreService);
        const firstDispatch: IMonitor = {
            have: 'USDT',
            want: 'BTC',
            currency_pair: 'USDT-BTC',
        };
        const firstDispatchStr = JSON.stringify({
            event,
            data: {
                monitor: firstDispatch,
            },
        });

        forgeStoreService.dispatch(actionSetMonitor(firstDispatch));

        const [first, firstName] = [genMockWs(), 'first', 0];
        let firstCallCounter = 0;
        const [second, secondName] = [genMockWs(), 'second', 0];
        let secondCallCounter = 0;

        forgeStoreService.addSubscriber(first, firstName);
        ++firstCallCounter;

        expect(first.send).toBeCalledWith(firstDispatchStr);

        const secondDispatch: IMonitor = {
            have: 'ETH',
            want: 'SHIBA',
            currency_pair: 'ETH-SHIBA',
        };
        const secondDispatchStr = JSON.stringify({
            event, data: {
                monitor: secondDispatch,
            }
        });

        forgeStoreService.dispatch(actionSetMonitor(secondDispatch));
        ++firstCallCounter;

        expect(first.send).toBeCalledWith(secondDispatchStr);

        forgeStoreService.addSubscriber(second, secondName);
        ++secondCallCounter;

        expect(second.send).toBeCalledWith(secondDispatchStr);

        forgeStoreService.rmSubscriber(secondName);

        forgeStoreService.dispatch(actionSetMonitor(firstDispatch));
        ++firstCallCounter;

        expect(first.send).toBeCalledWith(firstDispatchStr);
        expect(first.send).toBeCalledTimes(firstCallCounter);
        expect(second.send).toBeCalledTimes(secondCallCounter);
    });
});
