import { Module } from '@nestjs/common';
import { ConfigModule } from '@/infra/config/config.module';
import { CommonModule } from '@/infra/common/common.module';

@Module({
  imports: [ConfigModule, CommonModule],
})
export class AppModule {}
