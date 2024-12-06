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
import { ACCESS_TOKEN_COOKIE_NAME } from '@/shared/constants';
import { Reflector } from '@nestjs/core';
import { AuthMetadata } from '@/infra/api-common/decorators/auth.decorator';

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
    const shouldCheckAuth = this.reflector.get(AuthMetadata, context.getHandler());

    if (!shouldCheckAuth) {
      return true;
    }

    const jwtConfig = this.configService.get('jwt', { infer: true });

    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const token = this.getTokenFromHeader(request) ?? this.getTokenFromCookies(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      await this.jwtService.verify({ token, secret: jwtConfig.secret });
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private getTokenFromCookies(request: FastifyRequest): string | null {
    return request.cookies[ACCESS_TOKEN_COOKIE_NAME] ?? null;
  }

  private getTokenFromHeader(request: FastifyRequest): string | null {
    const header = request.headers.authorization;
    if (!header || !header.startsWith('Bearer')) {
      return null;
    }

    return header.split('Bearer ')[1] ?? null;
  }
}
