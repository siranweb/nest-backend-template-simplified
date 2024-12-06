import { Reflector } from '@nestjs/core';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { HttpError } from '@/shared/errors/common-errors';
import { ApiResponses } from '@/infra/api-common/decorators/api-responses.decorator';
import { ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';
import { ACCESS_TOKEN_COOKIE_NAME } from '@/shared/constants';

/**
 * Marks API that it's needs auth.
 */
export const AuthMetadata = Reflector.createDecorator<boolean>();

/**
 * Decorator for auth. Should be used for routes.
 */
export function Auth() {
  return applyDecorators(
    AuthMetadata(true),
    ApiResponses(HttpStatus.FORBIDDEN, [HttpError], { description: 'Access denied' }),
    ApiResponses(HttpStatus.UNAUTHORIZED, [HttpError], { description: 'Unauthorized' }),
    ApiBearerAuth(),
    ApiCookieAuth(ACCESS_TOKEN_COOKIE_NAME),
  );
}
