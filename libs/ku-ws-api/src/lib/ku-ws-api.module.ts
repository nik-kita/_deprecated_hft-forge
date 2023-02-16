import { HttpModule } from '@hft-forge/http';
import { WsClientModule } from '@hft-forge/ws';
import { Module } from '@nestjs/common';
import { KuWsApiService } from './ku-ws-api.service';


@Module({
	imports: [HttpModule, WsClientModule],
	providers: [KuWsApiService],
	exports: [KuWsApiService],
})
export class KuWsApiModule {}
