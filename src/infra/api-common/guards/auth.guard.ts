import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IJWTService } from '@/core/jwt/types/jwt-service.interface';
import { JWT_DI_CONSTANTS } from '@/core/jwt/jwt.di-constants';
import { CONFIG_DI_CONSTANTS } from '@/infra/config/config.di-constants';
import { IConfigService } from '@/infra/config/types/config-service.interface';
import { FastifyRequest } from 'fastify';
import { Reflector } from '@nestjs/core';
import { AuthModeMetadata } from '@/infra/api-common/decorators/auth.decorator';
import {
  getAccessTokenFromCookies,
  getAccessTokenFromHeader,
} from '@/infra/api-common/helpers/tokens';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(JWT_DI_CONSTANTS.JWT_SERVICE)
    private readonly jwtService: IJWTService,
    @Inject(CONFIG_DI_CONSTANTS.CONFIG_SERVICE)
    private readonly configService: IConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authMode = this.reflector.get(AuthModeMetadata, context.getHandler());

    if (!authMode) {
      return true;
    }

    const jwtConfig = this.configService.get('jwt', { infer: true });

    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const token = getAccessTokenFromHeader(request) ?? getAccessTokenFromCookies(request);

    if (!token) {
      if (authMode === 'normal') {
        throw new UnauthorizedException();
      } else {
        // Ignore unauthorized if soft
        return true;
      }
    }

    try {
      await this.jwtService.verify({ token, secret: jwtConfig.secret });
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
