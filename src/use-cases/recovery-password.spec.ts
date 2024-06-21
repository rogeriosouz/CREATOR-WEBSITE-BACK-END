import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { JwtJsonwebtokenService } from "@/services/jsonwebtoken/jwt-jsonwebtoken";
import { RecoveryPasswordUseCase } from "./recovery-password";
import { env } from "@/env";
import { UserNotFoundError } from "./errors/UserNotFoundError";
import { TokenInvalidError } from "./errors/TokenInvalidError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let jwtService: JwtJsonwebtokenService;

let sut: RecoveryPasswordUseCase;

describe("recovery password use case", async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    jwtService = new JwtJsonwebtokenService();

    sut = new RecoveryPasswordUseCase(inMemoryUsersRepository, jwtService);
  });

  it("It should be possible to recovery password", async () => {
    const email = "test@gmail.com";
    const userId = "user id test";

    inMemoryUsersRepository.create({
      id: userId,
      email,
      name: "test",
      password_hash: "hash",
      rules: "user",
    });

    const { jwt } = await jwtService.create({
      secret: env.SECRET_TOKEN_FORGOT_PASSWORD,
      config: {
        expiresIn: "1h",
      },
      payload: {
        userId,
      },
    });

    const { message } = await sut.execute({
      token: jwt,
      newPassword: "newPassword test",
    });

    expect(message).toEqual(expect.any(String));
  });

  it("It should not be possible to forget password with token invalid jwt.", async () => {
    const email = "test@gmail.com";
    const userId = "user id test";

    inMemoryUsersRepository.create({
      id: userId,
      email,
      name: "test",
      password_hash: "hash",
      rules: "user",
    });

    await expect(() =>
      sut.execute({
        token: "token invalid",
        newPassword: "newPassword test",
      }),
    ).rejects.toBeInstanceOf(TokenInvalidError);
  });

  it("It should not be possible to forget password with token invalid DB.", async () => {
    const email = "test@gmail.com";
    const userId = "user id test";

    inMemoryUsersRepository.create({
      id: userId,
      email,
      name: "test",
      password_hash: "hash",
      rules: "user",
    });

    const { jwt } = await jwtService.create({
      secret: env.SECRET_TOKEN_FORGOT_PASSWORD,
      config: {
        expiresIn: "1h",
      },
      payload: {
        userId,
      },
    });

    inMemoryUsersRepository.tokens.push({
      id: "id token test",
      token: jwt,
    });

    await expect(() =>
      sut.execute({
        token: jwt,
        newPassword: "newPassword test",
      }),
    ).rejects.toBeInstanceOf(TokenInvalidError);
  });

  it("It should not be possible to forget password with user nonexistent.", async () => {
    const { jwt } = await jwtService.create({
      secret: env.SECRET_TOKEN_FORGOT_PASSWORD,
      config: {
        expiresIn: "1h",
      },
      payload: {
        userId: "user id nonexistent",
      },
    });

    await expect(() =>
      sut.execute({
        token: jwt,
        newPassword: "newPassword test",
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });
});
