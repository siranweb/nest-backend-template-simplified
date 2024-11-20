import { Module } from '@nestjs/common';
import { ConfigModule } from '@/infra/config/config.module';
import { CommonModule } from '@/infra/common/common.module';
import { ApiModule } from '@/api/api.module';

@Module({
  imports: [ConfigModule, CommonModule, ApiModule],
})
export class AppModule {}
