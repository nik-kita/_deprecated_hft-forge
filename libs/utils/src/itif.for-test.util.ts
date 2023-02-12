import { it } from '@jest/globals';
import { Global } from '@jest/types/build';


export function itif(predicat: boolean): Global.ItBase {
    return predicat ? it : it.skip; 
}
