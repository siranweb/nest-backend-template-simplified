export interface IUsersService {
  hashPassword(password: string, salt: string): Promise<string>;
  createSalt(): string;
}
