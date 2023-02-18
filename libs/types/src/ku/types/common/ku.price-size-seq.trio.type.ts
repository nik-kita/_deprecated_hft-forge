import { PriceSizePair } from "./ku.price-size-pair.type";

export type PriceSizeSeq = [...PriceSizePair, `${number}.${number}`];
