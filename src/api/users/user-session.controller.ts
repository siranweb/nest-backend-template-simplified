import { Controller, Delete, Post } from '@nestjs/common';

@Controller('/users/me/session')
export class UserSessionController {
  @Post()
  public async login() {}

  @Delete()
  public async logout() {}

  @Post('/tokens')
  public async refresh() {}
}
