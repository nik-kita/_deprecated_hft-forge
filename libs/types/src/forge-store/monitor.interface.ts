export interface IMonitor<T extends string = string, U extends string = string> {
    have: T,
    want: U,
    currency_pair: `${T}-${U}`,
}
