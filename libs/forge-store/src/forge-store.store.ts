import { configureStore } from '@reduxjs/toolkit';
import { ForgeState } from '@hft-forge/types/forge-store';
import { monitorReducer } from './features/forge-store.monitor.feature';

type InitOptions = Parameters<typeof configureStore<ForgeState>>[0];

export const initForgeStore = (options: Partial<InitOptions> = {}) => configureStore<ForgeState>({
    reducer: {
        monitor: monitorReducer,
    },
    ...options,
});
