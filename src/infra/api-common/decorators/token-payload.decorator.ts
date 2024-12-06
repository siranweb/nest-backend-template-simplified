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
 */
export const TokenPayload = createParamDecorator(
  (_data: never, ctx: ExecutionContext): TAccessTokenPayload => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    const token = (getAccessTokenFromHeader(request) ?? getAccessTokenFromCookies(request))!;
    const payloadStr = token.split('.')[1];
    return JSON.parse(atob(payloadStr));
  },
);
