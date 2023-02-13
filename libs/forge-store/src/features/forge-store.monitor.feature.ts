import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ForgeState, IMonitor } from "@hft-forge/types/forge-store";


const initialState: IMonitor = {
    have: '',
    want: '',
    currency_pair: '-',
};

export const monitorSlice = createSlice({
    name: 'monitor',
    initialState,
    reducers: {
        setMonitorAction: (state, { payload }: PayloadAction<IMonitor>) => payload,
    },
});

export const {
    setMonitorAction: actionSetMonitor,
} = monitorSlice.actions;
export const selectMonitor = ({ monitor }: ForgeState) => monitor;
export const reducerForMonitor = monitorSlice.reducer;
