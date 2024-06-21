import { randomUUID } from "node:crypto";
import { InvalidToken, User, UsersRepository } from "../users-repository";

export class InMemoryUsersRepository implements UsersRepository {
  public items = [] as User[];
  public tokens = [] as InvalidToken[];

  async create(data: User) {
    const id = randomUUID();

    const user = {
      id,
      ...data,
    };

    this.items.push(user);

    return user;
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id);

    if (user) {
      return user;
    }

    return null;
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);

    if (user) {
      return user;
    }

    return null;
  }

  async findByInvalidToken(token: string) {
    const isToken = this.tokens.find((item) => item.token === token);

    if (!isToken) {
      return null;
    }

    return isToken;
  }

  async logOut(token: string) {
    this.tokens.push({
      id: randomUUID(),
      token,
    });
  }

  async invalidateToken(token: string) {
    this.tokens.push({
      id: randomUUID(),
      token,
    });
  }

  async recoveryPassword(userId: string, newPassword: string) {
    const userById = this.items.find((item) => item.id === userId);

    const newUser: User = {
      id: userById?.id,
      name: userById?.name as string,
      email: userById?.email as string,
      rules: userById?.rules as "user",
      password_hash: newPassword,
    };

    this.items = [newUser];
  }
}
