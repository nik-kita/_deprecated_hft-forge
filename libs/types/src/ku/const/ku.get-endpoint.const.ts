import { BASE_URL } from "./ku.url.const";

export const KU_GET_ENDPOINT = {
    order_book: {
        full: `${BASE_URL}/api/v3/market/orderbook/level2`,
    },
} as const;
