import { ForgeState } from '@hft-forge/types/forge-store';
import { initForgeStore, actionSetMonitor } from '../index';


const getForgeStateFixture = (state: Partial<ForgeState> = {}): ForgeState => {
    return {
        monitor: {
            have: 'hello',
            want: 'world',
            currency_pair: 'hello-world',
        },
        ...state,
    };
};

describe('ForgeStore', () => {
    let FORGE_STORE: ReturnType<typeof initForgeStore>;

    beforeEach(() => {
        FORGE_STORE = initForgeStore();
    });

    it('Should export all needed members', () => {
        expect(FORGE_STORE).toBeDefined();
    });

    it('Should get actual store', () => {
        expect(FORGE_STORE.getState()).toBeDefined();
    });

    it('Should dispatch setMonitorAction and change state', () => {
        const expected = getForgeStateFixture();

        FORGE_STORE.dispatch(actionSetMonitor({ ...expected.monitor }));

        const actual = FORGE_STORE.getState();

        expect(actual).toEqual(expected);
    });

    it('Should subscribe to ForgeState updates', () => {
        let updatesCounter = 0;

        FORGE_STORE.subscribe(() => ++updatesCounter);
        FORGE_STORE.dispatch(actionSetMonitor({
            have: 'ok',
            want: 'google',
            currency_pair: 'ok-google'
        }));

        expect(updatesCounter).toBe(1);
    });
});
