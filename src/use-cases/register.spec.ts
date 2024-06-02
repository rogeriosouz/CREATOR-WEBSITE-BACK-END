import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { RegisterUseCase } from "./register";
import { UserAlreadyExistsError } from "./errors/UserAlreadyExistsError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("register user case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(inMemoryUsersRepository);
  });

  it("should be able possible create user", async () => {
    const { user } = await sut.execute({
      name: "test",
      email: "test@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be possible to create a user with an existing email address", async () => {
    const email = "test@gmail.com";

    await sut.execute({
      name: "test",
      email,
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        name: "test",
        email,
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
