import { ConfigModule } from "@nestjs/config";

export function genMockConfigModule(envs: (string | { k: string, v: string })[] = []) {

    return ConfigModule.forRoot({
        isGlobal: true,
        ignoreEnvFile: true,
        load: [() => {

            return envs.reduce((acc, env) => {
                typeof env === 'string'
                    ? acc[env] = env
                    : acc[env.k] = acc[env.v];

                return acc;
            }, {} as Record<string, string>);
        }],
    });
}
