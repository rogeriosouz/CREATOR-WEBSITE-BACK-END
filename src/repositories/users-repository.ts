export type Rules = "adm" | "user";

export type User = {
  id?: string;
  name: string;
  email: string;
  password_hash: string;
  rules: Rules;
};

export type InvalidToken = {
  id: string;
  token: string;
};

export interface UsersRepository {
  create(data: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByInvalidToken(token: string): Promise<null | InvalidToken>;
  logOut(token: string): Promise<void>;
}
