import { KU_ENV_KEYS } from "../../const/ku.env.const";

export type KuEnvKey = (typeof KU_ENV_KEYS)[number];
export type KuEnv = Record<KuEnvKey, string>;
