import 'zod-openapi/extend';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IConfigService } from '@/infra/config/types/config-service.interface';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ErrorFilter } from '@/infra/common/filters/error.filter';
import { patchNestJsSwagger } from '@/lib/zod-dto/patch-nest-swagger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ZodDtoValidationPipe } from '@/infra/common/pipes/zod-dto-validation.pipe';
import { CONFIG_DI_CONSTANTS } from '@/infra/config/config.di-constants';
import { ILogger } from '@/lib/logger/types/logger.interface';
import { COMMON_DI_CONSTANTS } from '@/infra/common/common.providers';
import fastifyCookie from '@fastify/cookie';

patchNestJsSwagger();

// const fastifyInstance = fastify();
// fastifyInstance.addHook('preValidation', (request, reply, done) => {
//   console.log('payload: ', request.body);
//   done();
// });

// TODO move out to bootstrap module
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  await app.register(fastifyCookie);

  const configService = await app.resolve<IConfigService>(CONFIG_DI_CONSTANTS.CONFIG_SERVICE);
  const logger = await app.resolve<ILogger>(COMMON_DI_CONSTANTS.LOGGER);
  const config = configService.get('webServer', { infer: true });
  logger.setContext('Bootstrap');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Backend API')
    .setDescription('Backend public API')
    .setVersion('1.0')
    .setOpenAPIVersion('3.1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, documentFactory);

  app.enableShutdownHooks();
  app.useGlobalFilters(new ErrorFilter());
  app.useGlobalPipes(new ZodDtoValidationPipe());

  await app.listen(config.port, '0.0.0.0');

  logger.info('Server started!');
  logger.info(`OpenAPI documentation: http://localhost:${config.port}/docs`);
  logger.info(`OpenAPI JSON: http://localhost:${config.port}/docs-json`);
  logger.info(`OpenAPI YAML: http://localhost:${config.port}/docs-yaml`);
}
bootstrap();
