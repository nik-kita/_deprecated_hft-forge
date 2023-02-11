import { configureStore } from '@reduxjs/toolkit';
import { IMonitor } from './monitor.interface';

type ForgeStateType = {
    monitor: IMonitor,
};

type ForgeStore = ReturnType<typeof configureStore<ForgeStateType>>;

export type ForgeState = ReturnType<ForgeStore['getState']>;
export type ForgeDispatch = ForgeStore['dispatch'];
