import { ILogger } from '@/lib/logger/types/logger.interface';
import { IRefreshTokensCase } from '@/core/users/types/refresh-tokens-case.interface';
import { IUsersRepository } from '@/core/users/types/users-repository.interface';
import { TTokenPair } from '@/core/users/types/shared';
import { Inject, Injectable } from '@nestjs/common';
import { COMMON_DI_CONSTANTS } from '@/infra/common/common.providers';
import { USERS_DI_CONSTANTS } from '@/core/users/users.di-constants';
import { TokenInvalidError, UserNotFoundError } from '@/core/users/errors';
import { IUsersTokensService } from '@/core/users/types/users-tokens-service.interface';

@Injectable()
export class RefreshTokensCase implements IRefreshTokensCase {
  constructor(
    @Inject(COMMON_DI_CONSTANTS.LOGGER)
    private readonly logger: ILogger,
    @Inject(USERS_DI_CONSTANTS.USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
    @Inject(USERS_DI_CONSTANTS.USERS_TOKENS_SERVICE)
    private readonly usersTokensService: IUsersTokensService,
  ) {
    this.logger.setContext(RefreshTokensCase.name);
  }

  async execute(oldRefreshToken: string): Promise<TTokenPair> {
    this.logger.info('Starting tokens refreshing.');

    const isUsed = await this.usersTokensService.checkRefreshTokenUsed(oldRefreshToken);
    if (isUsed) throw new TokenInvalidError();

    const userId = await this.usersTokensService.getUserIdByToken(oldRefreshToken);
    if (!userId) throw new UserNotFoundError();

    const user = await this.usersRepository.getUserById(userId);
    if (!user) throw new UserNotFoundError();

    const tokens = await this.usersTokensService.createTokens(userId);

    await this.usersTokensService.makeRefreshTokenInvalid(oldRefreshToken);

    this.logger.info('Tokens were refreshed.');

    return tokens;
  }
}
