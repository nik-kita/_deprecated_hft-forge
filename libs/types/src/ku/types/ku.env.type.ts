export const KuEnvKeys = [
    'API_KEY',
    'API_SECRET',
    'API_PASSPHRASE',
] as const;
export type KuEnvKey = (typeof KuEnvKeys)[number];
export type KuEnv = Record<KuEnvKey, string>;
