import { Inject, Injectable } from '@nestjs/common';
import { ICryptographyService } from '@/core/cryptography/types/cryptography-service.interface';
import { CRYPTOGRAPHY_DI_CONSTANTS } from '@/core/cryptography/cryptography.di-constants';
import { IUsersService } from '@/core/users/types/users-service.interface';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject(CRYPTOGRAPHY_DI_CONSTANTS.CRYPTOGRAPHY_SERVICE)
    private readonly cryptographyService: ICryptographyService,
  ) {}

  public async hashPassword(password: string, salt: string): Promise<string> {
    return await this.cryptographyService.hash(password, salt, 1000);
  }

  public createSalt(): string {
    return this.cryptographyService.random(20);
  }
}
