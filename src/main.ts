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
import * as fastifyCookie from '@fastify/cookie';

patchNestJsSwagger();

// TODO move out to bootstrap module
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  await app.register(fastifyCookie);
  const adapter = app.getHttpAdapter();
  const instance = adapter.getInstance();
  const configService = await app.resolve<IConfigService>(CONFIG_DI_CONSTANTS.CONFIG_SERVICE);
  const bootstrapLogger = await app.resolve<ILogger>(COMMON_DI_CONSTANTS.LOGGER);
  const httpLogger = await app.resolve<ILogger>(COMMON_DI_CONSTANTS.LOGGER);
  const config = configService.get('webServer', { infer: true });

  bootstrapLogger.setContext('Bootstrap');
  httpLogger.setContext('HTTP');

  instance.addHook('preHandler', (request, _reply, done) => {
    if (request.originalUrl.startsWith('/docs')) {
      return done();
    }
    httpLogger.info('Incoming request.', {
      method: request.method,
      url: request.originalUrl,
      body: request.body,
    });
    done();
  });

  instance.addHook('onSend', (request, reply, payload, done) => {
    if (request.originalUrl.startsWith('/docs')) {
      return done();
    }
    httpLogger.info('Response sent.', {
      method: request.method,
      url: request.originalUrl,
      body: payload,
      status: reply.statusCode,
    });
    done();
  });

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

  bootstrapLogger.info('Server started!');
  bootstrapLogger.info(`OpenAPI documentation: http://localhost:${config.port}/docs`);
  bootstrapLogger.info(`OpenAPI JSON: http://localhost:${config.port}/docs-json`);
  bootstrapLogger.info(`OpenAPI YAML: http://localhost:${config.port}/docs-yaml`);
}
bootstrap();
