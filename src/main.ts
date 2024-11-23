import 'zod-openapi/extend';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { IConfigService } from '@/infra/config/types/config-service.interface';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ErrorFilter } from '@/infra/common/filters/error.filter';
import { patchNestJsSwagger } from '@/lib/zod-dto/patch-nest-swagger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ZodDtoValidationPipe } from '@/infra/common/pipes/zod-dto-validation.pipe';

patchNestJsSwagger();

// const fastifyInstance = fastify();
// fastifyInstance.addHook('preValidation', (request, reply, done) => {
//   console.log('payload: ', request.body);
//   done();
// });

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const configService = await app.resolve<IConfigService>(ConfigService);
  const config = configService.get('webServer', { infer: true });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Backend API')
    .setDescription('Backend public API')
    .setVersion('1.0')
    .setOpenAPIVersion('3.0.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, documentFactory);

  app.enableShutdownHooks();
  app.useGlobalFilters(new ErrorFilter());
  app.useGlobalPipes(new ZodDtoValidationPipe());

  await app.listen(config.port, '0.0.0.0');
}
bootstrap();
