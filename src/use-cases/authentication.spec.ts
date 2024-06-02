import { describe, it, beforeEach, expect } from "vitest";
import { AuthenticationUseCase } from "./authentication";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { JwtJsonwebtokenService } from "@/services/jsonwebtoken/jwt-jsonwebtoken";
import { hashPassword } from "@/utils/hashPassword";
import { InvalidCredentialsError } from "./errors/InvalidCredentialsError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let jwtService: JwtJsonwebtokenService;

let sut: AuthenticationUseCase;

describe("authentication use case", async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    jwtService = new JwtJsonwebtokenService();

    sut = new AuthenticationUseCase(inMemoryUsersRepository, jwtService);
  });

  it("should be possible to authenticate the user", async () => {
    const name = "test";
    const email = "test@gmail.com";
    const password = "123456";
    const password_hash = await hashPassword(password);

    inMemoryUsersRepository.create({
      id: "id test",
      name,
      email,
      password_hash,
      rules: "user",
    });

    const { user } = await sut.execute({
      email,
      password,
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be possible to authenticate a user with a non-existent email", async () => {
    const name = "test";
    const email = "test@gmail.com";
    const password = "123456";
    const password_hash = await hashPassword(password);

    inMemoryUsersRepository.create({
      id: "id test",
      name,
      email,
      password_hash,
      rules: "user",
    });

    await expect(() =>
      sut.execute({
        email: "nonexistent@gmail.com",
        password,
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be possible to authenticate a user with an incorrect password", async () => {
    const name = "test";
    const email = "test@gmail.com";
    const password = "123456";
    const password_hash = await hashPassword(password);

    inMemoryUsersRepository.create({
      id: "id test",
      name,
      email,
      password_hash,
      rules: "user",
    });

    await expect(() =>
      sut.execute({
        email,
        password: "password incorrect",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
