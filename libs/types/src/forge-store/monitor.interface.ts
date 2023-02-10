export interface IMonitor {
    have: string,
    want: string,
    currency_pair: `${IMonitor['have']}/${IMonitor['want']}`,
}
