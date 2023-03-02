const ku_env_keys = [
    'API_KEY',
    'API_SECRET',
    'API_PASSPHRASE',
] as const;

export const KU_ENV_KEYS = ku_env_keys.map((k) => k);
export type KuEnvKeys = (typeof ku_env_keys)[number];
