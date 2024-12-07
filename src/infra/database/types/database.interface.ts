import { Kysely } from 'kysely';
import { TUserTable } from '@/infra/database/tables/user.table';
import { TInvalidRefreshTokenTable } from '@/infra/database/tables/invalid-refresh-token.table';
import { TMigrationTable } from '@/infra/database/tables/migration.table';

type TTables = {
  user: TUserTable;
  invalid_refresh_token: TInvalidRefreshTokenTable;
  __migration: TMigrationTable;
};
export interface IDatabase extends Kysely<TTables> {}
