import { HttpMethod } from "../../../common";

export type KuReq<
    M extends HttpMethod,
    E extends string = string,
    Q extends (object | undefined) = undefined,
    B extends (object | undefined) = undefined,
> = {
    method: M,
    endpoint: E,
    query?: Q,
    body?: B,
};
