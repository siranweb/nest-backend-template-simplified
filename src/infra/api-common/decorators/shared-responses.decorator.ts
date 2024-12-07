import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponses } from '@/infra/api-common/decorators/api-responses.decorator';
import { UnknownError, ValidationError } from '@/shared/errors/common-errors';

/**
 * Same api responses across all controllers.
 */
export function SharedResponses() {
  return applyDecorators(
    ApiResponses(HttpStatus.BAD_REQUEST, [ValidationError], { description: 'Request failed' }),
    ApiResponses(HttpStatus.INTERNAL_SERVER_ERROR, [UnknownError], {
      description: 'Internal server error',
    }),
  );
}
