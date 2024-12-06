import { Module } from '@nestjs/common';
import { ConfigModule } from '@/infra/config/config.module';
import { providers, publicProviders } from '@/infra/common/common.providers';

@Module({
  imports: [ConfigModule],
  providers,
  exports: publicProviders,
})
export class CommonModule {}
