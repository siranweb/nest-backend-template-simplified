import { Module } from '@nestjs/common';
import { providers, publicProviders } from '@/core/jwt/jwt.providers';

@Module({
  providers,
  exports: publicProviders,
})
export class JwtModule {}
