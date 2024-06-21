import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { ForgotPasswordUseCase } from "./forgot-password";
import { JwtJsonwebtokenService } from "@/services/jsonwebtoken/jwt-jsonwebtoken";
import { InMemoryEmailService } from "@/services/in-memory/in-memory-email-service";
import { UserNotFoundError } from "./errors/UserNotFoundError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let jwtService: JwtJsonwebtokenService;
let emailService: InMemoryEmailService;
let sut: ForgotPasswordUseCase;

describe("forgot password use case", async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    jwtService = new JwtJsonwebtokenService();
    emailService = new InMemoryEmailService();

    sut = new ForgotPasswordUseCase(
      inMemoryUsersRepository,
      emailService,
      jwtService,
    );
  });

  it("It should be possible to forget password", async () => {
    const email = "test@gmail.com";

    inMemoryUsersRepository.create({
      id: "id test",
      email,
      name: "test",
      password_hash: "hash",
      rules: "user",
    });

    const { message } = await sut.execute({
      email,
    });

    expect(message).toEqual(expect.any(String));
  });

  it("It should not be possible to forget password with user nonexistent.", async () => {
    const email = "test@gmail.com";

    await expect(() =>
      sut.execute({
        email,
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });
});
