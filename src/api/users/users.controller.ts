import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponses } from '@/infra/api-common/decorators/api-responses.decorator';
import { Auth } from '@/infra/api-common/decorators/auth.decorator';
import { SharedResponses } from '@/infra/api-common/decorators/shared-responses.decorator';
import { TokenPayload } from '@/infra/api-common/decorators/token-payload.decorator';
import { TAccessTokenPayload } from '@/core/users/types/shared';

@ApiTags('users')
@Controller('/users')
@SharedResponses()
export class UsersController {
  @Post()
  @ApiOperation({ summary: 'Create user and get tokens' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponses(HttpStatus.NO_CONTENT, { description: 'User created' })
  public async create() {}

  @Get('/users/me/profile')
  @Auth()
  @ApiOperation({ summary: 'Returns authorized user profile' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponses(HttpStatus.NO_CONTENT, { description: 'User profile TODO' })
  public async authProtected(@TokenPayload() payload: TAccessTokenPayload) {
    console.log(payload.userId);
  }
}
