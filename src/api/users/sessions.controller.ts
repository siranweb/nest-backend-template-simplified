import { FastifyReply, FastifyRequest } from 'fastify';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { UserCredentialsDto } from '@/api/users/dto/user-credentials.dto';
import { ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ILoginCase } from '@/core/users/types/login-case.interface';
import { USERS_DI_CONSTANTS } from '@/core/users/users.di-constants';
import { IRefreshTokensCase } from '@/core/users/types/refresh-tokens-case.interface';
import { UserLoginTakenError, UserNotFoundError } from '@/core/users/errors';
import { ApiResponses } from '@/infra/api-common/decorators/api-responses.decorator';
import { UnknownError, ValidationError } from '@/shared/errors/common-errors';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '@/shared/constants';

@ApiTags('sessions')
@Controller('/sessions')
@ApiResponses(HttpStatus.BAD_REQUEST, [ValidationError])
@ApiResponses(HttpStatus.INTERNAL_SERVER_ERROR, [UnknownError])
export class SessionsController {
  constructor(
    @Inject(USERS_DI_CONSTANTS.LOGIN_CASE)
    private readonly loginCase: ILoginCase,
    @Inject(USERS_DI_CONSTANTS.REFRESH_TOKENS_CASE)
    private readonly refreshTokensCase: IRefreshTokensCase,
  ) {}

  @Post('/auth')
  @ApiOperation({ summary: 'Authorize and get cookies' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponses(HttpStatus.BAD_REQUEST, [UserLoginTakenError, UserNotFoundError])
  public async login(
    @Res({ passthrough: true })
    reply: FastifyReply,
    @Body() dto: UserCredentialsDto,
  ): Promise<void> {
    const { accessToken, refreshToken } = await this.loginCase.execute(dto);
    this.setCookies(reply, accessToken, refreshToken);
  }

  @Delete()
  @ApiOperation({ summary: 'Remove cookies' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  public async logout(
    @Res({ passthrough: true })
    reply: FastifyReply,
  ) {
    this.clearCookies(reply);
  }

  @Post('/tokens')
  @ApiOperation({ summary: 'Create new tokens by refresh token' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  public async refresh(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true })
    reply: FastifyReply,
  ) {
    const oldRefreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

    if (!oldRefreshToken) {
      throw new HttpException({}, HttpStatus.FORBIDDEN);
    }

    const { accessToken, refreshToken } = await this.refreshTokensCase.execute(oldRefreshToken);
    this.setCookies(reply, accessToken, refreshToken);
  }

  private clearCookies(reply: FastifyReply): void {
    reply.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
    reply.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
  }

  private setCookies(reply: FastifyReply, accessToken: string, refreshToken: string): void {
    reply.setCookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      sameSite: 'strict',
      httpOnly: true,
    });
    reply.setCookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      sameSite: 'strict',
      httpOnly: true,
    });
  }
}
