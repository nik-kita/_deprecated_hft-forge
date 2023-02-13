import { it } from '@jest/globals';
import { Global } from '@jest/types/build';
import { config } from 'dotenv';

type NeedEnvType = {
    needEnv: { envFilePath: string, envVariables: string[] },
};

function isRequiredEnvVariablesProvided(options: NeedEnvType['needEnv']) {
    const { envFilePath, envVariables } = options;

    config({ path: envFilePath });

    const missedVariables = envVariables.filter((v) => !process.env[v]);

    if (missedVariables.length) {
        console.warn(`Test is skipped. Add such variables to '${envFilePath}' file:\n${missedVariables}`);

        return false;
    }

    return true;
}

export function itif(condition: NeedEnvType): Global.ItBase {
    let predicate = false;

    if (process.env.ITIF !== 'true') {
        console.warn(`Test is skipped. Run with ITIF=true to enable their execution:\nITIF=true npx nx test ...`);
    } else {
        const { needEnv } = condition;

        if (needEnv) {
            predicate = isRequiredEnvVariablesProvided(needEnv);
        }
    }

    return predicate ? it : it.skip;
}


