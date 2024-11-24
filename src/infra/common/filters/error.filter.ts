import { FastifyReply } from 'fastify';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { AppError } from '@/shared/errors/app-error';
import { ZodError } from 'zod';
import { HttpError, UnknownError, ValidationError } from '@/shared/errors/common-errors';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  public catch(error: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();

    let specificError: AppError<Record<string, any>>;
    let status: number;

    if (error instanceof HttpException) {
      specificError = new HttpError();
      status = error.getStatus();
    } else if (error instanceof AppError) {
      specificError = error;
      status = 400;
    } else if (error instanceof ZodError) {
      specificError = new ValidationError({ issues: error.issues });
      status = 400;
    } else {
      specificError = new UnknownError();
      status = 500;
    }

    reply.status(status).send({ name: specificError.name, data: specificError.data });
  }
}
