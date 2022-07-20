import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ConfigDocument, Options } from './config/swagger.config';
import { getLevel } from './utils/logger.class';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLevel(process.env.NODE_ENV),
    cors: true,
  });

  app.enableCors();
  app.setGlobalPrefix('api/v1');

  const config = app.get<ConfigService>(ConfigService);

  const document = SwaggerModule.createDocument(
    app,
    ConfigDocument,
    Options.swaggerOptions,
  );


  SwaggerModule.setup('/api/v1/docs', app, document, Options);
  await app.listen(config.get<number>('PORT'));
}

bootstrap();
