import { ClassProvider, Provider } from '@nestjs/common';
import { JwtService } from '@/core/jwt/services/jwt.service';
import { IJWTService } from '@/core/jwt/types/jwt-service.interface';

export const JWT_DI_CONSTANTS = {
  JWT_SERVICE: Symbol('JWT_SERVICE'),
}

export const publicProviders: Provider[] = [
  {
    provide: JWT_DI_CONSTANTS.JWT_SERVICE,
    useClass: JwtService,
  } satisfies ClassProvider<IJWTService>
];

export const providers: Provider[] = [
  ...publicProviders,
];
