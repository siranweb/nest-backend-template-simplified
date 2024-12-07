import { Module } from '@nestjs/common';
import { providers, publicProviders } from '@/core/cryptography/cryptography.providers';

@Module({
  providers,
  exports: publicProviders,
})
export class CryptographyModule {}
