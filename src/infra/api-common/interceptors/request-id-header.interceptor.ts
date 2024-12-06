import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, map } from 'rxjs/operators';
import { IRequestAsyncStorage } from '@/infra/common/types/request-async-storage.interface';
import { COMMON_DI_CONSTANTS } from '@/infra/common/common.di-constants';

@Injectable()
export class RequestIdHeaderInterceptor implements NestInterceptor {
  constructor(
    @Inject(COMMON_DI_CONSTANTS.REQUEST_ASYNC_STORAGE)
    private readonly requestAsyncStorage: IRequestAsyncStorage,
  ) {}

  public intercept(context: ExecutionContext, next: CallHandler) {
    const response = context.switchToHttp().getResponse();
    const requestId = this.requestAsyncStorage.getStore()?.requestId;
    return next.handle().pipe(
      catchError((err) => {
        if (requestId) {
          response.raw.setHeader('X-Request-Id', requestId);
        }
        throw err;
      }),
      map((data) => {
        if (requestId) {
          response.raw.setHeader('X-Request-Id', requestId);
        }
        return data;
      }),
    );
  }
}
