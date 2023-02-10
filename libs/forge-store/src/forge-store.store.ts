import { configureStore } from '@reduxjs/toolkit';
import { monitorReducer } from './features/forge-store.monitor.feature';


export const FORGE_STORE = configureStore({
    reducer: {
        monitor: monitorReducer,
    },
});

export type ForgeState = ReturnType<typeof FORGE_STORE.getState>
export type ForgeDispatch = typeof FORGE_STORE.dispatch
