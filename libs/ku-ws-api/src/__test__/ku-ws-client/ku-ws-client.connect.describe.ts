import { describe, expect, it } from '@jest/globals';
import { INestApplication } from '@nestjs/common';


export function Describe_Check_$connect$_method_of_$KuWsClient$(getMocks: () => {
    mockApp: INestApplication,
}) {
    return describe(Describe_Check_$connect$_method_of_$KuWsClient$
        .name
        .replaceAll('_', ' ')
        .replace('Describe', '')
        .replaceAll('$', '/'), () => {

            it('MockApp should be defined', () => {
                expect(getMocks().mockApp).toBeDefined();
            });
        });
}
