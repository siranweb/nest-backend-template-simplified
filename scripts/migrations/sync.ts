import { NestFactory } from '@nestjs/core';
import { DatabaseModule } from '@/infra/database/database.module';
import { DATABASE_DI_CONSTANTS } from '@/infra/database/database.providers';
import { IMigrator } from '@/infra/database/types/migrator.interface';
import { askQuestion } from '@/shared/utils/cli';

const force = process.argv.includes('--force');

(async () => {
  const appContext = await NestFactory.createApplicationContext(DatabaseModule, { logger: false });
  const migrator = appContext.get<IMigrator>(DATABASE_DI_CONSTANTS.MIGRATOR);
  await migrator.init();

  if (!force) {
    const syncSteps = await migrator.sync({ dry: true });
    const isDataLossPossible = syncSteps.some((step) => step.direction === 'down');
    if (isDataLossPossible) {
      console.log(syncSteps);
      const answer = await askQuestion('Data loss possible! Type "ok" to continue.');
      if (answer !== 'ok') {
        return;
      }
    }
  }

  await migrator.sync();
})();
