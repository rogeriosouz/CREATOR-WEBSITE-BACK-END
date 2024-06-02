import { sql } from "@/lib/postgres";
import { InvalidToken, User, UsersRepository } from "../users-repository";

export class PostgresUsersRepository implements UsersRepository {
  async create({ name, email, password_hash }: User) {
    const user =
      await sql/* sql */ `INSERT INTO users (name, email, password_hash) 
    VALUES (${name}, ${email}, ${password_hash}) RETURNING *;
    `;

    return user[0] as User;
  }

  async findById(id: string) {
    const user = await sql/* sql */ `SELECT * FROM users WHERE id = ${id}`;

    return user[0] as User;
  }

  async findByEmail(email: string) {
    const user =
      await sql/* sql */ `SELECT * FROM users WHERE email = ${email}`;

    return user[0] as User;
  }

  async findByInvalidToken(token: string) {
    const tokens =
      await sql/* sql */ `SELECT * FROM invalid_tokens WHERE token = ${token}`;

    if (tokens.length >= 1) {
      return tokens[0] as InvalidToken;
    }

    return null;
  }

  async logOut(token: string) {
    await sql/* sql */ `INSERT INTO invalid_tokens (token) VALUES (${token})`;
  }
}
