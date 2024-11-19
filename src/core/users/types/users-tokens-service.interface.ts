import { TTokenPair } from '@/core/users/types/shared';

export interface IUsersTokensService {
  createTokens(userId: string): Promise<TTokenPair>;
  validateToken(token: string): Promise<boolean>;
  makeRefreshTokenInvalid(token: string): Promise<void>;
  checkRefreshTokenUsed(token: string): Promise<boolean>;
  getUserIdByToken(token: string): Promise<string | null>;
}
