import { describe, expect, it } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { KuWsClient } from '../../lib/ku-ws-api.ku-ws.client';


export default function (getMocks: () => {
    mockApp: INestApplication,
    mockAppUrl: string,
}) {
    return describe('Check /.connect()/ method of /KuWsClient/', () => {

        it('MockApp should be defined', () => {
            const {
                mockApp,
                mockAppUrl,
            } = getMocks();
            expect(mockApp).toBeDefined();
            expect(mockAppUrl.replace('http', 'ws')).toMatch(/^ws/);
            console.log(mockAppUrl);
        });

        it('Should connect to mockApp', async () => {
            const {
                mockApp,
                mockAppUrl,
            } = getMocks();
            const client = new KuWsClient();

            await client.connect(mockAppUrl.replace('http', 'ws'));

            client.__getOriginWs().close();

            expect('errors').not.toBe('throwed');
        });
    });
}
