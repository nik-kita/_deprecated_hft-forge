import { WsClientModule } from '@hft-forge/ws';
import { Module } from '@nestjs/common';
import { KuHttpApiModule } from '@hft-forge/ku-http-api';
import { KuWsApiService } from './ku-ws-api.service';


@Module({
	imports: [KuHttpApiModule, WsClientModule],
	providers: [KuWsApiService],
	exports: [KuWsApiService],
})
export class KuWsApiModule {}
