export type GateMessage<T extends string, U = undefined> = U extends void ? {
    event: T,
} : {
    event: T,
    data: U,
}
