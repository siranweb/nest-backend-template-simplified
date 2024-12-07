import { CryptographyService } from '@/core/cryptography/services/cryptography.service';
import { Provider } from '@nestjs/common';
import { CRYPTOGRAPHY_DI_CONSTANTS } from '@/core/cryptography/cryptography.di-constants';
import { ICryptographyService } from '@/core/cryptography/types/cryptography-service.interface';

export const publicProviders: Provider[] = [
  {
    provide: CRYPTOGRAPHY_DI_CONSTANTS.CRYPTOGRAPHY_SERVICE,
    useClass: CryptographyService,
  } satisfies Provider<ICryptographyService>,
];

export const providers: Provider[] = [...publicProviders];
