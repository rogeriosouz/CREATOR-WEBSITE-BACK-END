import { beforeEach, describe, expect, it } from "vitest";
import { GetTokenInvalidUseCase } from "./get-token-invalid";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: GetTokenInvalidUseCase;

describe("get-token-invalid use case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new GetTokenInvalidUseCase(inMemoryUsersRepository);
  });

  it("should be possible to see an invalid token", async () => {
    const token = "token test";

    inMemoryUsersRepository.tokens.push({
      id: "token test",
      token,
    });

    const { isTokenValid } = await sut.execute({
      token,
    });

    expect(isTokenValid).toEqual(true);
  });

  it("should be possible to see a valid token", async () => {
    const token = "token test";

    const { isTokenValid } = await sut.execute({
      token,
    });

    expect(isTokenValid).toEqual(false);
  });
});
