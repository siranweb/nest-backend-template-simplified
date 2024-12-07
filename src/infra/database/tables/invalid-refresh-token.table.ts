import { TTableBase } from './base';

export type TInvalidRefreshTokenTable = TTableBase & {
  token: string;
};
