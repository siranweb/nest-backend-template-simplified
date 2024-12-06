import { Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponses } from '@/infra/api-common/decorators/api-responses.decorator';
import { UnknownError, ValidationError } from '@/shared/errors/common-errors';
import { Auth } from '@/infra/api-common/decorators/auth.decorator';

@ApiTags('users')
@Controller('/users')
@ApiResponses(HttpStatus.BAD_REQUEST, [ValidationError])
@ApiResponses(HttpStatus.INTERNAL_SERVER_ERROR, [UnknownError])
export class UsersController {
  @Post()
  public async create() {}

  @Get('test')
  @Auth()
  @ApiNoContentResponse()
  public async authProtected() {}
}
