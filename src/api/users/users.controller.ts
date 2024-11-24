import { Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponses } from '@/infra/common/decorators/api-responses.decorator';
import { UnknownError, ValidationError } from '@/shared/errors/common-errors';

@ApiTags('users')
@Controller('/users')
@ApiResponses(HttpStatus.BAD_REQUEST, [ValidationError])
@ApiResponses(HttpStatus.INTERNAL_SERVER_ERROR, [UnknownError])
export class UsersController {
  @Post()
  public async create() {}
}
