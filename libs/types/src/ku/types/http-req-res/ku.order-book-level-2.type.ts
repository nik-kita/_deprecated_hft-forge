import { KU_GET_ENDPOINT } from "../../const";
import { KuReq } from "../common/ku-req.type";
import { PriceSizePair } from "../common/ku.price-size-pair.type";

export type KuReq_order_book_level_2_full = KuReq<
    'GET',
    typeof KU_GET_ENDPOINT['order_book']['full'],
    { symbol: string }
>;
export type KuRes_order_book_level2_full = {
    code: "200000",
    data: {
        time: number,
        sequence: `${number}`,
        bids: PriceSizePair[],
        asks: PriceSizePair[],
    },
};
