import { NestFactory } from '@nestjs/core';
import { DatabaseModule } from '@/infra/database/database.module';
import { DATABASE_DI_CONSTANTS } from '@/infra/database/database.providers';
import { IMigrator } from '@/infra/database/types/migrator.interface';
import { askQuestion } from '@/shared/utils/cli';

(async () => {
  const appContext = await NestFactory.createApplicationContext(DatabaseModule, { logger: false });
  const migrator = appContext.get<IMigrator>(DATABASE_DI_CONSTANTS.MIGRATOR);

  const title = await askQuestion('Enter migration title: ');

  await migrator.createEmptyMigrationFiles(title);
})();