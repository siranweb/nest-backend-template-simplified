import { ILogger } from '@/lib/logger/types/logger.interface';
import { IUsersRepository } from '@/core/users/types/users-repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { COMMON_DI_CONSTANTS } from '@/infra/common/common.di-constants';
import { USERS_DI_CONSTANTS } from '@/core/users/users.di-constants';
import {
  IGetUserProfileCase,
  TUserProfile,
} from '@/core/users/types/get-user-profile-case.interface';
import { UserNotFoundError } from '@/core/users/errors';

@Injectable()
export class GetUserProfileCase implements IGetUserProfileCase {
  constructor(
    @Inject(COMMON_DI_CONSTANTS.LOGGER)
    private readonly logger: ILogger,
    @Inject(USERS_DI_CONSTANTS.USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {
    this.logger.setContext(GetUserProfileCase.name);
  }

  public async execute(userId: string): Promise<TUserProfile> {
    this.logger.info('Starting getting user profile', { userId });

    const user = await this.usersRepository.getUserById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const profile: TUserProfile = {
      login: user.login,
    };

    this.logger.info('Successfully got user profile', { profile });

    return profile;
  }
}
