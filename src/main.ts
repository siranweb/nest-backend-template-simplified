import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { IConfigService } from '@/infra/config/types/config-service.interface';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ErrorFilter } from '@/infra/common/filters/error.filter';

// const fastifyInstance = fastify();
// fastifyInstance.addHook('preValidation', (request, reply, done) => {
//   console.log('payload: ', request.body);
//   done();
// });

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const configService = await app.resolve<IConfigService>(ConfigService);
  const config = configService.get('webServer', { infer: true });

  app.enableShutdownHooks();
  app.useGlobalFilters(new ErrorFilter());
  await app.listen(config.port, '0.0.0.0');
}
bootstrap();
