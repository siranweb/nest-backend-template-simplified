import { Module } from '@nestjs/common';
import { ConfigModule } from '@/infra/config/config.module';
import { ApiCommonModule } from '@/infra/api-common/api-common.module';
import { ApiModule } from '@/api/api.module';
import { CommonModule } from '@/infra/common/common.module';

@Module({
  imports: [ConfigModule, CommonModule, ApiCommonModule, ApiModule],
})
export class AppModule {}
