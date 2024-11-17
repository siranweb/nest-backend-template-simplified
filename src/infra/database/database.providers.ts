import path from 'node:path';
import pg from 'pg';
import { Provider } from '@nestjs/common';
import { IDatabase } from '@/infra/database/types/database.interface';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { ConfigService } from '@nestjs/config';
import { IConfigService } from '@/infra/config/types/config-service.interface';
import { IMigrator } from '@/infra/database/types/migrator.interface';
import { MigrationsCore } from 'sql-migrations-core';
import { SqlActions } from '@/infra/database/migrator/sql-actions';

export const DATABASE_DI_CONSTANTS = {
  DATABASE: Symbol('DATABASE'),
  MIGRATOR: Symbol('MIGRATOR'),
}

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
    inject: [ConfigService],
  },
  {
    provide: DATABASE_DI_CONSTANTS.MIGRATOR,
    useFactory(db: IDatabase): IMigrator {
      return MigrationsCore.create({
        path: path.resolve('migrations', 'db'),
        sqlActions: new SqlActions(db),
      });
    },
    inject: [DATABASE_DI_CONSTANTS.DATABASE],
  }
];

export const providers: Provider[] = [
  ...publicProviders,
];
