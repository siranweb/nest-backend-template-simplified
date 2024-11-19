import { TTokenPair, TUserCredentials } from '@/core/users/types/shared';

export interface ICreateUserCase {
  execute(credentials: TUserCredentials): Promise<TTokenPair>;
}
