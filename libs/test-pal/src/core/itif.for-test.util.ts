import { it } from '@jest/globals';
import { Global } from '@jest/types/build';
import { config } from 'dotenv';

type NeedEnvType = {
    needEnv: { envFilePath: string, envVariables: string[] },
};
type CustomConditionType = {
    customCondition: boolean | ((...args: any[]) => boolean),
}

function isRequiredEnvVariablesProvided(options: NeedEnvType['needEnv']) {
    const { envFilePath, envVariables } = options;

    config({ path: envFilePath });
    
    const currEnvVariables = Object.getOwnPropertyNames(process.env);
    const missedVariables = envVariables.filter((v) => !currEnvVariables.includes(v));

    if (missedVariables.length) {
        console.warn(`Test is skipped. Add such variables to '${envFilePath}' file:\n${missedVariables}`);

        return false;
    }

    return true;
}

export function itif(condition: {
    skip_cli_ITIF?: boolean,
} & (NeedEnvType | CustomConditionType)): Global.ItBase {
    const { skip_cli_ITIF = false } = condition;

    if (process.env.ITIF !== 'true' && !skip_cli_ITIF) {
        console.warn(`Test is skipped. Run with ITIF=true to enable their execution.\nExample:\n\nITIF=true npm run test`);
    } else {
        const {
            needEnv,
            customCondition,
        } = condition as Partial<NeedEnvType> & Partial<CustomConditionType>;

        if (needEnv) {
            if (!isRequiredEnvVariablesProvided(needEnv)) return it.skip;
        }

        if (customCondition !== undefined) {
            const predicate = typeof customCondition === 'boolean'
                ? customCondition
                : customCondition();
            
            if (!predicate) return it.skip;
        }

        return it;
    }

    return it.skip;
}
