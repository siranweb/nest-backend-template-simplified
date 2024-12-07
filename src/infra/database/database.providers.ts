import * as path from 'node:path';
import SQLite from 'better-sqlite3';
import { Provider } from '@nestjs/common';
import { IDatabase } from '@/infra/database/types/database.interface';
import { CamelCasePlugin, Kysely, SqliteDialect } from 'kysely';
import { IMigrator } from '@/infra/database/types/migrator.interface';
import { MigrationsCore } from 'sql-migrations-core';
import { KyselyAdapter } from '@/infra/database/migrator/kysely-adapter';
import { DATABASE_DI_CONSTANTS } from '@/infra/database/database.di-constants';

export const publicProviders: Provider[] = [
  {
    provide: DATABASE_DI_CONSTANTS.DATABASE,
    useFactory(): IDatabase {
      return new Kysely({
        dialect: new SqliteDialect({
          database: new SQLite(path.resolve('db/app.db')),
        }),
        plugins: [
          new CamelCasePlugin({
            underscoreBeforeDigits: true,
          }),
        ],
      });
    },
  } satisfies Provider<IDatabase>,
  {
    provide: DATABASE_DI_CONSTANTS.MIGRATOR,
    useFactory(db: IDatabase): IMigrator {
      return MigrationsCore.create({
        migrationsDir: path.resolve('migrations', 'db'),
        adapter: new KyselyAdapter(db),
      });
    },
    inject: [DATABASE_DI_CONSTANTS.DATABASE],
  } satisfies Provider<IMigrator>,
];

export const providers: Provider[] = [...publicProviders];
