import { HttpModule } from '@hft-forge/http';
import { Module } from '@nestjs/common';
import { KuReq } from './ku-http-api.ku-req.service';
import { KuSignGeneratorService } from './ku-http-api.sign-generator.service';

@Module({
	imports: [HttpModule],
	providers: [KuSignGeneratorService, KuReq],
	exports: [KuReq],
})
export class KuHttpApiModule {}
