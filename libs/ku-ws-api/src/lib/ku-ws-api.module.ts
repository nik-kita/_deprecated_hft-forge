import { Module } from '@nestjs/common';
import { KuWsClient } from './ku-ws-api.ku-ws.client';

@Module({
	controllers: [],
	providers: [KuWsClient],
	exports: [KuWsClient],
})
export class KuWsApiModule {}
