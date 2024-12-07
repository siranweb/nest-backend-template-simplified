export type TUserCredentials = {
  login: string;
  password: string;
};

export type TTokenPair = {
  accessToken: string;
  refreshToken: string;
};

export type TAccessTokenPayload = {
  userId: string;
};

export type TRefreshTokenPayload = {
  userId: string;
};
