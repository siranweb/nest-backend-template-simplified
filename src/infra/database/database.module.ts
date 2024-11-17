import { Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigModule } from '@/infra/config/config.module';
import { DATABASE_DI_CONSTANTS, providers, publicProviders } from '@/infra/database/database.providers';
import { IDatabase } from '@/infra/database/types/database.interface';

@Module({
  imports: [ConfigModule],
  providers,
  exports: publicProviders,
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(
    @Inject(DATABASE_DI_CONSTANTS.DATABASE)
    private readonly db: IDatabase
  ) {}

  public async onApplicationShutdown(): Promise<void> {
    await this.db.destroy();
  }
}
