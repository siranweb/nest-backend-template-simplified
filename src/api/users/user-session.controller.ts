import { Body, Controller, Delete, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserCredentialsDto } from '@/api/users/dto/user-credentials.dto';

@Controller('/users/me/session')
export class UserSessionController {
  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async login(@Body() _dto: UserCredentialsDto) {
    console.log(123);
  }

  @Delete()
  public async logout() {}

  @Post('/tokens')
  public async refresh() {}
}
