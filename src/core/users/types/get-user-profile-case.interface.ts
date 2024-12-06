export interface IGetUserProfileCase {
  execute(userId: string): Promise<TUserProfile>;
}

export type TUserProfile = {
  login: string;
};
