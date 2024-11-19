import { Module } from '@nestjs/common';
import { providers, publicProviders } from '@/infra/common/common.providers';
import { ConfigModule } from '@/infra/config/config.module';

@Module({
  imports: [ConfigModule],
  providers,
  exports: publicProviders,
})
export class CommonModule {}
