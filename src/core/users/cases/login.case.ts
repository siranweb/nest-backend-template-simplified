import { ILogger } from '@/lib/logger/types/logger.interface';
import { ILoginCase } from '@/core/users/types/login-case.interface';
import { IUsersRepository } from '@/core/users/types/users-repository.interface';
import { TTokenPair, TUserCredentials } from '@/core/users/types/shared';
import { Inject, Injectable } from '@nestjs/common';
import { COMMON_DI_CONSTANTS } from '@/infra/common/common.providers';
import { USERS_DI_CONSTANTS } from '@/core/users/users.providers';
import { UserNotFoundError, UserWrongPasswordError } from '@/core/users/errors';
import { IUsersTokensService } from '@/core/users/types/users-tokens-service.interface';
import { IUsersService } from '@/core/users/types/users-service.interface';

@Injectable()
export class LoginCase implements ILoginCase {
  constructor(
    @Inject(COMMON_DI_CONSTANTS.LOGGER)
    private readonly logger: ILogger,
    @Inject(USERS_DI_CONSTANTS.USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
    @Inject(USERS_DI_CONSTANTS.USERS_TOKENS_SERVICE)
    private readonly usersTokensService: IUsersTokensService,
    @Inject(USERS_DI_CONSTANTS.USERS_SERVICE)
    private readonly usersService: IUsersService,
  ) {
    this.logger.setContext(LoginCase.name);
  }

  async execute(credentials: TUserCredentials): Promise<TTokenPair> {
    const { login, password } = credentials;
    this.logger.info('Starting login.', { login });

    const user = await this.usersRepository.getUserByLogin(login);
    if (!user) {
      throw new UserNotFoundError();
    }

    const passwordHash = await this.usersService.hashPassword(password, user.salt);
    const isRightPassword = user.isCorrectPasswordHash(passwordHash);
    if (!isRightPassword) {
      throw new UserWrongPasswordError();
    }

    const tokens = await this.usersTokensService.createTokens(user.id);

    this.logger.info('Success login.', { user });

    return tokens;
  }
}
