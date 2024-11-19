import { Provider } from '@nestjs/common';
import { CryptographyService } from '@/core/cryptography/services/cryptography.service';
import { ICryptographyService } from '@/core/cryptography/types/cryptography-service.interface';

export const CRYPTOGRAPHY_DI_CONSTANTS = {
  CRYPTOGRAPHY_SERVICE: Symbol('CRYPTOGRAPHY_SERVICE'),
};

export const publicProviders: Provider[] = [
  {
    provide: CRYPTOGRAPHY_DI_CONSTANTS.CRYPTOGRAPHY_SERVICE,
    useClass: CryptographyService,
  } satisfies Provider<ICryptographyService>,
];

export const providers: Provider[] = [...publicProviders];
