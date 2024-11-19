import { FastifyReply } from 'fastify';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { AppError } from '@/shared/errors/app-error';
import { ZodError } from 'zod';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  public catch(error: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();

    if (error instanceof HttpException) {
      const status = error.getStatus();
      reply.status(status).send({
        name: 'HTTP',
        data: {},
      });
      return;
    }

    if (error instanceof AppError) {
      reply.status(400).send({
        name: error.name,
        data: error.data,
      });
      return;
    }

    if (error instanceof ZodError) {
      reply.status(400).send({
        name: 'VALIDATION',
        data: error.issues,
      });
      return;
    }

    reply.status(500).send({
      name: 'UNKNOWN',
      data: {},
    });
  }
}
