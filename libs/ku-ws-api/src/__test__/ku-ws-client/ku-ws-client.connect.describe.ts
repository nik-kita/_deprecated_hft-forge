import { describe, expect, it } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { KuWsClient } from '../../lib/ku-ws-api.ku-ws.client';
import { MockGate } from './mocks';


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
            const mockGate = mockApp.get(MockGate);

            expect(mockGate.connectionCounts).toBe(0);
            
            await client.connect(mockAppUrl.replace('http', 'ws'));
            
            expect(mockGate.connectionCounts).toBe(1);
            
            const originWs = client.__getOriginWs();
            
            await new Promise((resolve) => {
                originWs.on('close', resolve);
                originWs.close();
            });
            
            expect(mockGate.connectionCounts).toBe(0);
            expect('errors').not.toBe('throwed');
        });
    });
}
