import { Module } from '@nestjs/common';
import { providers, publicProviders } from '@/infra/common/common.providers';
import { ConfigModule } from '@/infra/config/config.module';
import { JwtModule } from '@/core/jwt/jwt.module';

// TODO split to Common and ApiCommon
@Module({
  imports: [ConfigModule, JwtModule],
  providers,
  exports: publicProviders,
})
export class CommonModule {}
