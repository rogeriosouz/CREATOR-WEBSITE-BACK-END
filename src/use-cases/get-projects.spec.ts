import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryProjectsRepository } from "@/repositories/in-memory/in-memory-projects-repository";
import { GetProjectsUseCase } from "./get-projects";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserNotFoundError } from "./errors/UserNotFoundError";

let inMemoryProjectsRepository: InMemoryProjectsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: GetProjectsUseCase;

describe("get project use case", async () => {
  beforeEach(() => {
    inMemoryProjectsRepository = new InMemoryProjectsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new GetProjectsUseCase(
      inMemoryProjectsRepository,
      inMemoryUsersRepository,
    );
  });

  it("should be possible to list all projects", async () => {
    const authorId = "id test";

    inMemoryUsersRepository.create({
      id: authorId,
      name: "test",
      email: "test@gmail.com",
      password_hash: "hash",
      rules: "user",
    });

    inMemoryProjectsRepository.create({
      id: "id project 1",
      authorId,
      name: "name project 1 test",
      user_id: authorId,
    });

    inMemoryProjectsRepository.create({
      id: "id project 2",
      authorId,
      name: "name project 2 test",
      user_id: authorId,
    });

    const { projects } = await sut.execute({
      userId: authorId,
    });

    expect(projects[0].name).toEqual(expect.any(String));
  });

  it("should not be possible to list projects if the user id is non-existent", async () => {
    const authorId = "id test";

    inMemoryProjectsRepository.create({
      id: "id project 1",
      authorId,
      name: "name project 1 test",
      user_id: authorId,
    });

    await expect(() =>
      sut.execute({
        userId: authorId,
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });
});
