import { sql } from 'kysely';
import { IMigrationsStorageAdapter } from 'sql-migrations-core';
import { IDatabase } from '@/infra/database/types/database.interface';

export class KyselyAdapter implements IMigrationsStorageAdapter {
  constructor(private readonly db: IDatabase) {}

  async createMigrationsTable(): Promise<void> {
    await this.db.schema
      .createTable('__migration')
      .ifNotExists()
      .addColumn('name', 'varchar', (cb) => cb.notNull().unique())
      .addColumn('migrated_at', 'timestamp', (cb) => cb.notNull().defaultTo(sql`current_timestamp`))
      .execute();
  }

  async getMigrationsNames(): Promise<string[]> {
    const records = await this.db.selectFrom('__migration').select('name').execute();
    return records.map((r) => r.name);
  }

  async migrateUp(name: string, query: string): Promise<void> {
    await this.db.transaction().execute(async (trx) => {
      await trx.insertInto('__migration').values({ name: name }).execute();
      await sql.raw(query).execute(trx);
    });
  }

  async migrateDown(name: string, query: string): Promise<void> {
    await this.db.transaction().execute(async (trx) => {
      await this.db.deleteFrom('__migration').where('name', '=', name).execute();
      await sql.raw(query).execute(trx);
    });
  }
}
