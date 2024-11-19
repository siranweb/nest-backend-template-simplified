import { TTableBase } from './base';

export type TUserTable = TTableBase & {
  id: string;
  login: string;
  passwordHash: string;
  salt: string;
};
