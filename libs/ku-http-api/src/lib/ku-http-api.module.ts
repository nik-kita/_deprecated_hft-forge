import { HttpModule } from '@hft-forge/http';
import { Module } from '@nestjs/common';
import { KuReqService } from './ku-http-api.ku-req.service';
import { KuSignGeneratorService } from './ku-http-api.sign-generator.service';

@Module({
	imports: [HttpModule],
	providers: [KuSignGeneratorService, KuReqService],
	exports: [KuReqService],
})
export class KuHttpApiModule {}
