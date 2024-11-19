import { Module } from '@nestjs/common';
import { providers, publicProviders } from '@/core/users/users.providers';

@Module({
  providers,
  exports: publicProviders,
})
export class UsersModule {}
