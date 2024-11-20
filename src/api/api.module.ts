import { Module } from '@nestjs/common';
import { UserSessionController } from '@/api/users/user-session.controller';
import { UsersController } from '@/api/users/users.controller';

@Module({
  controllers: [UsersController, UserSessionController],
})
export class ApiModule {}
