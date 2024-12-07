import { Module } from '@nestjs/common';
import { SessionsController } from '@/api/users/sessions.controller';
import { UsersController } from '@/api/users/users.controller';
import { UsersModule } from '@/core/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [UsersController, SessionsController],
})
export class ApiModule {}
