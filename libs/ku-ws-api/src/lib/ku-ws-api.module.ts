import { HttpModule } from '@hft-forge/http';
import { WsClientModule } from '@hft-forge/ws';
import { Module } from '@nestjs/common';


@Module({
	imports: [HttpModule, WsClientModule],
	exports: [],
})
export class KuWsApiModule {}
