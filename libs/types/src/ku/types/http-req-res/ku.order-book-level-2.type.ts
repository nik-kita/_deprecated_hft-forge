import { KU_GET_ENDPOINT } from "../../const";
import { KuReq } from "../common/ku-req.type";

export type KuReq_order_book_level_2 = KuReq<
    'GET',
    typeof KU_GET_ENDPOINT['order_book']['full'],
    { symbol: string }
>;
