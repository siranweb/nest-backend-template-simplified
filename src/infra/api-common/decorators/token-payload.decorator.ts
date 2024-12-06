import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  getAccessTokenFromCookies,
  getAccessTokenFromHeader,
} from '@/infra/api-common/helpers/tokens';
import { FastifyRequest } from 'fastify';
import { TAccessTokenPayload } from '@/core/users/types/shared';

/**
 * Used to get token payload without validation and other checks.
 * Should be used with @Auth decorator.
 * If no token - returns null. Useful with "soft" auth mode.
 */
export const TokenPayload = createParamDecorator(
  (_data: never, ctx: ExecutionContext): TAccessTokenPayload | null => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    const token = getAccessTokenFromHeader(request) ?? getAccessTokenFromCookies(request);

    if (!token) {
      return null;
    }

    const payloadStr = token.split('.')[1];
    try {
      return JSON.parse(atob(payloadStr));
    } catch {
      return null;
    }
  },
);
