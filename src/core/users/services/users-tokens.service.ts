import { Inject, Injectable } from '@nestjs/common';
import { IJWTService } from '@/core/jwt/types/jwt-service.interface';
import { JWT_DI_CONSTANTS } from '@/core/jwt/jwt.di-constants';
import { CONFIG_DI_CONSTANTS } from '@/infra/config/config.di-constants';
import { IConfigService } from '@/infra/config/types/config-service.interface';
import { TConfiguration } from '@/infra/config/configuration/configuration.schema';
import { USERS_DI_CONSTANTS } from '@/core/users/users.di-constants';
import { IUsersRepository } from '@/core/users/types/users-repository.interface';
import { TTokenPair } from '@/core/users/types/shared';
import { IUsersTokensService } from '@/core/users/types/users-tokens-service.interface';

@Injectable()
export class UsersTokensService implements IUsersTokensService {
  private readonly jwtConfig: TConfiguration['jwt'];

  constructor(
    @Inject(JWT_DI_CONSTANTS.JWT_SERVICE)
    private readonly jwtService: IJWTService,
    @Inject(CONFIG_DI_CONSTANTS.CONFIG_SERVICE)
    private readonly configService: IConfigService,
    @Inject(USERS_DI_CONSTANTS.USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {
    this.jwtConfig = this.configService.get('jwt', { infer: true });
  }

  public async createTokens(userId: string): Promise<TTokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.createToken({
        payload: {
          id: userId,
        },
        secret: this.jwtConfig.secret,
        expirationTime: this.jwtConfig.accessToken.expirationTime,
      }),
      await this.jwtService.createToken({
        payload: {
          id: userId,
        },
        secret: this.jwtConfig.secret,
        expirationTime: this.jwtConfig.refreshToken.expirationTime,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  public async validateToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verify({
        token,
        secret: this.jwtConfig.secret,
      });
      return true;
    } catch {
      return false;
    }
  }

  public async makeRefreshTokenInvalid(token: string): Promise<void> {
    await this.usersRepository.storeInvalidRefreshToken(token);
  }

  public async checkRefreshTokenUsed(token: string): Promise<boolean> {
    return await this.usersRepository.isRefreshTokenUsed(token);
  }

  public async getUserIdByToken(token: string): Promise<string | null> {
    const { payload } = await this.jwtService.verify({
      token,
      secret: this.jwtConfig.secret,
    });

    return payload.id ?? null;
  }
}
