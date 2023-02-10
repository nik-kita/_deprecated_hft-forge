import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';


async function bootstrap() {
  const logger = new Logger('apps/app::main::bootstrap()');
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  const port = process.env.PORT || 3333;

  app.setGlobalPrefix(globalPrefix);

  await app.listen(port);

  logger.debug(`🚀 Application is running on: ${await app.getUrl()}`);
}

bootstrap();
