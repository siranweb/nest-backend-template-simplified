import { Module } from '@nestjs/common';
import { providers, publicProviders } from '@/core/users/users.providers';
import { JwtModule } from '@/core/jwt/jwt.module';
import { CryptographyModule } from '@/core/cryptography/cryptography.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { CommonModule } from '@/infra/common/common.module';

@Module({
  imports: [CommonModule, DatabaseModule, JwtModule, CryptographyModule],
  providers,
  exports: publicProviders,
})
export class UsersModule {}
