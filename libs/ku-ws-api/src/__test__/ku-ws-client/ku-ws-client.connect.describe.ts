import { describe, expect, it } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { KuWsClient } from '../..';

export default function (getMocks: () => {
    mockApp: INestApplication,
}) {
    return describe('Check /.connect()/ method of /KuWsClient/', () => {

            it('MockApp should be defined', () => {
                expect(getMocks().mockApp).toBeDefined();
            });
        });
}
