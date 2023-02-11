export const ENDPOINT = {
    GET: {
        order_book: {
            full: (symbol: string) => `/api/v3/market/orderbook/level2?symbol=${symbol}`,
        },
    },
} as const;
