import { Module } from '@nestjs/common';
import { providers, publicProviders } from '@/infra/api-common/api-common.providers';
import { JwtModule } from '@/core/jwt/jwt.module';
import { CommonModule } from '@/infra/common/common.module';

@Module({
  imports: [CommonModule, JwtModule],
  providers,
  exports: publicProviders,
})
export class ApiCommonModule {}
