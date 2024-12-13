import { uuidv7 } from 'uuidv7';

export class User {
  public id: string;
  public login: string;
  public passwordHash: string;
  public salt: string;

  constructor(data: TUserParams) {
    this.id = data.id ?? uuidv7();
    this.login = data.login;
    this.passwordHash = data.passwordHash;
    this.salt = data.salt;
  }

  public toPlain(): TUserPlain {
    return {
      id: this.id,
      login: this.login,
      passwordHash: this.passwordHash,
      salt: this.salt,
    };
  }

  public toPlainProfile(): TUserProfile {
    return {
      id: this.id,
      login: this.login,
    };
  }

  public isCorrectPasswordHash(hash: string): boolean {
    return hash === this.passwordHash;
  }
}

export type TUserParams = {
  id?: string;
  login: string;
  passwordHash: string;
  salt: string;
};

export type TUserPlain = {
  id: string;
  login: string;
  passwordHash: string;
  salt: string;
};

export type TUserProfile = {
  id: string;
  login: string;
};
