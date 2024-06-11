import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hashPassword } from "@/utils/hashPassword";
import { LogoutUseCase } from "./logout";
import { UserNotFoundError } from "./errors/UserNotFoundError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: LogoutUseCase;

describe("logout use case", async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new LogoutUseCase(inMemoryUsersRepository);
  });

  it("should be possible to Logout the user", async () => {
    const name = "test";
    const email = "test@gmail.com";
    const password = "123456";
    const password_hash = await hashPassword(password);
    const userId = "id test";
    const token = "token Test";

    inMemoryUsersRepository.create({
      id: userId,
      name,
      email,
      password_hash,
      rules: "user",
    });

    const { message } = await sut.execute({
      token,
      userId,
    });

    expect(message).toEqual(expect.any(String));
  });

  it("should be possible to Logout the user", async () => {
    const name = "test";
    const email = "test@gmail.com";
    const password = "123456";
    const password_hash = await hashPassword(password);
    const userId = "id test";
    const token = "token Test";

    inMemoryUsersRepository.create({
      id: userId,
      name,
      email,
      password_hash,
      rules: "user",
    });

    const { message } = await sut.execute({
      token,
      userId,
    });

    expect(message).toEqual(expect.any(String));
  });

  it("should not be possible to logout with a non-existent user", async () => {
    const userId = "id test";
    const token = "token Test";

    expect(() =>
      sut.execute({
        token,
        userId,
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });
});
