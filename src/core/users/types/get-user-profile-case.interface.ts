import { TUserProfile } from '@/core/users/entities/user.entity';

export interface IGetUserProfileCase {
  execute(userId: string): Promise<TUserProfile>;
}
