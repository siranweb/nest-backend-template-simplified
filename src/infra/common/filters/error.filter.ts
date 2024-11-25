import { FastifyReply } from 'fastify';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Inject } from '@nestjs/common';
import { AppError } from '@/shared/errors/app-error';
import { ZodError } from 'zod';
import { HttpError, UnknownError, ValidationError } from '@/shared/errors/common-errors';
import { ILogger } from '@/lib/logger/types/logger.interface';
import { COMMON_DI_CONSTANTS } from '@/infra/common/common.di-constants';
import { normalizeError } from '@/shared/errors/normalize-error';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  constructor(
    @Inject(COMMON_DI_CONSTANTS.LOGGER)
    private readonly logger: ILogger,
  ) {
    this.logger.setContext(ErrorFilter.name);
  }

  public catch(error: unknown, host: ArgumentsHost) {
    const normalized = normalizeError(error);
    this.logger.error(normalized, 'Got error.');

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
