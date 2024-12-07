import { NestFactory } from '@nestjs/core';
import { DatabaseModule } from '@/infra/database/database.module';
import { DATABASE_DI_CONSTANTS } from '@/infra/database/database.di-constants';
import { IMigrator } from '@/infra/database/types/migrator.interface';

(async () => {
  const appContext = await NestFactory.createApplicationContext(DatabaseModule, { logger: false });
  const migrator = appContext.get<IMigrator>(DATABASE_DI_CONSTANTS.MIGRATOR);
  await migrator.init();

  await migrator.down();
})();
