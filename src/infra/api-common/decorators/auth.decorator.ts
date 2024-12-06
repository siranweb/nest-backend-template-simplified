import { Reflector } from '@nestjs/core';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { HttpError } from '@/shared/errors/common-errors';
import { ApiResponses } from '@/infra/api-common/decorators/api-responses.decorator';
import { ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';
import { ACCESS_TOKEN_COOKIE_NAME } from '@/shared/constants';
import { TAuthMode } from '@/infra/api-common/types/auth-decorator.types';

/**
 * Marks API that it's needs auth.
 */
export const AuthModeMetadata = Reflector.createDecorator<TAuthMode>();

/**
 * Decorator for auth. Should be used for routes.
 * @param [mode] Mode of auth. Default - normal
 */
export function Auth(mode: TAuthMode = 'normal') {
  const decorators = [
    AuthModeMetadata(mode),
    ApiResponses(HttpStatus.FORBIDDEN, [HttpError], { description: 'Access denied' }),
    ApiBearerAuth(),
    ApiCookieAuth(ACCESS_TOKEN_COOKIE_NAME),
  ];

  if (mode === 'normal') {
    decorators.push(
      ApiResponses(HttpStatus.UNAUTHORIZED, [HttpError], { description: 'Unauthorized' }),
    );
  }

  return applyDecorators(...decorators);
}
