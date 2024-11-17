import { Kysely } from 'kysely';
import { UserTable } from '@/infra/database/tables/user.table';
import { InvalidRefreshTokenTable } from '@/infra/database/tables/invalid-refresh-token.table';
import { MigrationTable } from '@/infra/database/tables/migration.table';

type Tables = {
  user: UserTable;
  invalidRefreshToken: InvalidRefreshTokenTable;
  __migration: MigrationTable;
};
export type IDatabase = Kysely<Tables>;
