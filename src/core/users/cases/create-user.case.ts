import { ILogger } from '@/lib/logger/types/logger.interface';
import { TTokenPair, TUserCredentials } from '@/core/users/types/shared';
import { ICreateUserCase } from '@/core/users/types/create-user-case.interface';
import { IUsersRepository } from '@/core/users/types/users-repository.interface';
import { User } from '@/core/users/entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { USERS_DI_CONSTANTS } from '@/core/users/users.di-constants';
import { UserLoginTakenError } from '@/core/users/errors';
import { IUsersTokensService } from '@/core/users/types/users-tokens-service.interface';
import { IUsersService } from '@/core/users/types/users-service.interface';
import { COMMON_DI_CONSTANTS } from '@/infra/common/common.di-constants';

@Injectable()
export class CreateUserCase implements ICreateUserCase {
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
    this.logger.setContext(CreateUserCase.name);
  }
  async execute(credentials: TUserCredentials): Promise<TTokenPair> {
    const { login, password } = credentials;
    this.logger.info('Starting user creating.', { login });

    const isLoginTaken = await this.checkIsLoginTaken(login);
    if (isLoginTaken) {
      throw new UserLoginTakenError({ login });
    }

    const user = await this.createUser(login, password);
    await this.usersRepository.saveUser(user);

    const tokens = await this.usersTokensService.createTokens(user.id);

    this.logger.info('User was created.', user);
    return tokens;
  }

  private async checkIsLoginTaken(login: string): Promise<boolean> {
    return !!(await this.usersRepository.getUserByLogin(login));
  }

  private async createUser(login: string, password: string): Promise<User> {
    const salt = this.usersService.createSalt();
    const passwordHash = await this.usersService.hashPassword(password, salt);

    return new User({
      login,
      passwordHash,
      salt,
    });
  }
}
