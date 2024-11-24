import { JWT_DI_CONSTANTS } from '@/core/jwt/jwt.di-constants';
import { Provider } from '@nestjs/common';
import { JwtService } from '@/core/jwt/services/jwt.service';
import { IJWTService } from '@/core/jwt/types/jwt-service.interface';

export const publicProviders: Provider[] = [
  {
    provide: JWT_DI_CONSTANTS.JWT_SERVICE,
    useClass: JwtService,
  } satisfies Provider<IJWTService>,
];

export const providers: Provider[] = [...publicProviders];
