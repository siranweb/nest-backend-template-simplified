import { TTokenPair, TUserCredentials } from '@/core/users/types/shared';

export interface ILoginCase {
  execute(credentials: TUserCredentials): Promise<TTokenPair>;
}
