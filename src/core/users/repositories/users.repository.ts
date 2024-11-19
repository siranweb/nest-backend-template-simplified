import { IUsersRepository } from '@/core/users/types/users-repository.interface';
import { User } from '@/core/users/entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_DI_CONSTANTS } from '@/infra/database/database.providers';
import { IDatabase } from '@/infra/database/types/database.interface';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @Inject(DATABASE_DI_CONSTANTS.DATABASE)
    private readonly db: IDatabase,
  ) {}

  async saveUser(user: User): Promise<User> {
    const result = await this.db
      .insertInto('user')
      .values(user)
      .returningAll()
      .executeTakeFirstOrThrow();

    return new User(result);
  }

  async getUserByLogin(login: string): Promise<User | null> {
    const result = await this.db
      .selectFrom('user')
      .where('login', '=', login)
      .selectAll()
      .executeTakeFirst();

    return result ? new User(result) : null;
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await this.db
      .selectFrom('user')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return result ? new User(result) : null;
  }

  async storeInvalidRefreshToken(token: string): Promise<void> {
    await this.db
      .insertInto('invalid_refresh_token')
      .values({ token })
      .returning('token')
      .execute();
  }

  async isRefreshTokenUsed(token: string): Promise<boolean> {
    const result = await this.db
      .selectFrom('invalid_refresh_token')
      .where('token', '=', token)
      .select('token')
      .executeTakeFirst();
    return !!result;
  }
}
