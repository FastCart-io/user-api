import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { RequestMethod } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ConfigDocument, Options } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);

  console.log('config' + config);
  const document = SwaggerModule.createDocument(
    app,
    ConfigDocument,
    Options.swaggerOptions,
  );

  app.setGlobalPrefix('api/v1', {
    exclude: [
      {
        path: 'swagger',
        method: RequestMethod.GET,
      },
    ],
  });

  SwaggerModule.setup('swagger', app, document, Options);
  await app.listen(config.get<number>('PORT'));
}

bootstrap();
