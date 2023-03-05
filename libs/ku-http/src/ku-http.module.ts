import { Module } from '@nestjs/common';
import { KuHttpService } from './ku-http.service';

@Module({
  providers: [KuHttpService],
  exports: [KuHttpService],
})
export class KuHttpModule {}
