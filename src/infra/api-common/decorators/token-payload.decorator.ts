import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  getAccessTokenFromCookies,
  getAccessTokenFromHeader,
} from '@/infra/api-common/helpers/tokens';
import { FastifyRequest } from 'fastify';
import { TAccessTokenPayload } from '@/core/users/types/shared';

/**
 * Используется для получения payload'а токена без валидации.
 * Должен использоваться вместе с декоратором @Auth.
 * Если токена нет - возвращает null. Полезно вместе с "soft" режимом.
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
