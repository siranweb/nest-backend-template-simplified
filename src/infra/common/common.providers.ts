import { IConfigService } from '@/infra/config/types/config-service.interface';
import { IRequestAsyncStorage } from '@/infra/common/types/request-async-storage.interface';
import { ILogger } from '@/lib/logger/types/logger.interface';
import { Logger } from '@/lib/logger';
import { CONFIG_DI_CONSTANTS } from '@/infra/config/config.di-constants';
import { Provider, Scope } from '@nestjs/common';
import { COMMON_DI_CONSTANTS } from '@/infra/common/common.di-constants';
import { requestAsyncStorage } from '@/infra/api-common/providers/request-async-storage.provider';

export const publicProviders: Provider[] = [
  {
    provide: COMMON_DI_CONSTANTS.LOGGER,
    useFactory(configService: IConfigService, requestsAsyncStorage: IRequestAsyncStorage): ILogger {
      const nodeEnv = configService.get('nodeEnv', { infer: true });
      return new Logger({ nodeEnv, asyncStorage: requestsAsyncStorage });
    },
    inject: [CONFIG_DI_CONSTANTS.CONFIG_SERVICE, COMMON_DI_CONSTANTS.REQUEST_ASYNC_STORAGE],
    scope: Scope.TRANSIENT,
  } satisfies Provider<ILogger>,
  {
    provide: COMMON_DI_CONSTANTS.REQUEST_ASYNC_STORAGE,
    useValue: requestAsyncStorage,
  } satisfies Provider<IRequestAsyncStorage>,
];

export const providers: Provider[] = [...publicProviders];
