import { DocumentBuilder, ExpressSwaggerCustomOptions, SwaggerCustomOptions } from '@nestjs/swagger';

export const ConfigDocument = new DocumentBuilder()
  .setTitle("Todo Cart Api's")
  .setDescription('The Todo Cart Official API')
  .setVersion('v1.0')
  .setTermsOfService('http://2doCarts.co/therms')
  .setContact('API Support', 'support@2doCart.to', 'http://2doCarts.co/support')
  .setLicense('MIT', 'https://github.com/ZiXyos/ToDo-Cart/blob/master/LICENSE')
  .addBearerAuth()
  .build();

export const Options: ExpressSwaggerCustomOptions = {
  explorer: true,
  swaggerOptions: {
    deepScanRoutes: true,
  },
};
