import { FastifyInstance } from 'fastify';
import { ILogger } from '@/lib/logger/types/logger.interface';

export function setInstanceHooks(instance: FastifyInstance, logger: ILogger): void {
  instance.addHook('preHandler', (request, _reply, done) => {
    if (request.originalUrl.startsWith('/docs')) {
      return done();
    }
    logger.info('Incoming request.', {
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
    logger.info('Response sent.', {
      method: request.method,
      url: request.originalUrl,
      body: payload,
      status: reply.statusCode,
    });
    done();
  });
}
