import { TTokenPair } from '@/core/users/types/shared';

export interface IRefreshTokensCase {
  execute(oldRefreshToken: string): Promise<TTokenPair>;
}
