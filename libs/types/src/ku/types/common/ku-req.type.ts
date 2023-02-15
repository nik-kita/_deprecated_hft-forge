import { HttpMethod } from "../../../common";

export type KuReq<
    M extends HttpMethod,
    E extends string,
    Q extends object | undefined = undefined,
    B extends object | undefined = undefined,
> = Q extends undefined
        ? B extends undefined
            ? {
                method: M,
                endpoint: E,
            }
            : {
                method: M,
                endpoint: E,
                body: B,
            }
        : B extends undefined 
            ? {
                method: M,
                endpoint: E,
                query: Q,
            }
            : {
                method: M,
                endpoint: E,
                query: Q,
                body: B,
            };
