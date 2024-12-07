import { API_COMMON_DI_CONSTANTS } from '@/infra/api-common/api-common.di-constants';
import { CanActivate, ExceptionFilter, NestInterceptor, Provider } from '@nestjs/common';
import { ErrorFilter } from '@/infra/api-common/filters/error.filter';
import { RequestIdHeaderInterceptor } from '@/infra/api-common/interceptors/request-id-header.interceptor';
import { AuthGuard } from '@/infra/api-common/guards/auth.guard';

export const publicProviders: Provider[] = [
  {
    provide: API_COMMON_DI_CONSTANTS.ERROR_FILTER,
    useClass: ErrorFilter,
  } satisfies Provider<ExceptionFilter>,
  {
    provide: API_COMMON_DI_CONSTANTS.AUTH_GUARD,
    useClass: AuthGuard,
  } satisfies Provider<CanActivate>,
  {
    provide: API_COMMON_DI_CONSTANTS.REQUEST_ID_HEADER_INTERCEPTOR,
    useClass: RequestIdHeaderInterceptor,
  } satisfies Provider<NestInterceptor>,
];

export const providers: Provider[] = [...publicProviders];
