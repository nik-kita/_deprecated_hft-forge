import { Module } from '@nestjs/common';
import { KuSignGeneratorService } from './ku-http-api.sign-generator.service';

@Module({
	controllers: [],
	providers: [KuSignGeneratorService],
	exports: [],
})
export class KuHttpApiModule {}
