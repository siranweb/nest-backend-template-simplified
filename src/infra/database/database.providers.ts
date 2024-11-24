import * as path from 'node:path';
import * as pg from 'pg';
import { Provider } from '@nestjs/common';
import { IDatabase } from '@/infra/database/types/database.interface';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { IConfigService } from '@/infra/config/types/config-service.interface';
import { IMigrator } from '@/infra/database/types/migrator.interface';
import { MigrationsCore } from 'sql-migrations-core';
import { SqlActions } from '@/infra/database/migrator/sql-actions';
import { CONFIG_DI_CONSTANTS } from '@/infra/config/config.di-constants';

export const DATABASE_DI_CONSTANTS = {
  DATABASE: Symbol('DATABASE'),
  MIGRATOR: Symbol('MIGRATOR'),
};

export const publicProviders: Provider[] = [
  {
    provide: DATABASE_DI_CONSTANTS.DATABASE,
    useFactory(configService: IConfigService): IDatabase {
      const config = configService.get('database', { infer: true });
      return new Kysely({
        dialect: new PostgresDialect({
          pool: new pg.Pool({
            database: config.db,
            user: config.user,
            password: config.password,
            host: config.host,
            port: config.port,
            max: 10,
          }),
        }),
        plugins: [
          new CamelCasePlugin({
            underscoreBeforeDigits: true,
          }),
        ],
      });
    },
    inject: [CONFIG_DI_CONSTANTS.CONFIG_SERVICE],
  } satisfies Provider<IDatabase>,
  {
    provide: DATABASE_DI_CONSTANTS.MIGRATOR,
    useFactory(db: IDatabase): IMigrator {
      return MigrationsCore.create({
        path: path.resolve('migrations', 'db'),
        sqlActions: new SqlActions(db),
      });
    },
    inject: [DATABASE_DI_CONSTANTS.DATABASE],
  } satisfies Provider<IMigrator>,
];

export const providers: Provider[] = [...publicProviders];
