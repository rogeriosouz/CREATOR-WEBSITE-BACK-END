import { describe, it, beforeEach, expect } from "vitest";
import { CreateProjectUseCase } from "./create-project";
import { InMemoryProjectsRepository } from "@/repositories/in-memory/in-memory-projects-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { ProjectAlreadyExistsError } from "./errors/ProjectAlreadyExistsError";
import { UserNotFoundError } from "./errors/UserNotFoundError";

let inMemoryProjectsRepository: InMemoryProjectsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: CreateProjectUseCase;

describe("create project use case", async () => {
  beforeEach(() => {
    inMemoryProjectsRepository = new InMemoryProjectsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new CreateProjectUseCase(
      inMemoryProjectsRepository,
      inMemoryUsersRepository,
    );
  });

  it("should be possible to create project", async () => {
    const authorId = "id test";

    inMemoryUsersRepository.create({
      id: authorId,
      name: "test",
      email: "test@gmail.com",
      password_hash: "hash",
      rules: "user",
    });

    const { project } = await sut.execute({
      name: "test",
      authorId,
    });

    expect(project.id).toEqual(expect.any(String));
  });

  it("should not be possible to create a project with an insistent author", async () => {
    const authorId = "id test";

    await expect(() =>
      sut.execute({
        name: "test",
        authorId,
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it("should not be possible to create a project with an existing name", async () => {
    const authorId = "id test";

    inMemoryUsersRepository.create({
      id: authorId,
      name: "test",
      email: "test@gmail.com",
      password_hash: "hash",
      rules: "user",
    });

    await sut.execute({
      name: "test",
      authorId,
    });

    await expect(() =>
      sut.execute({
        name: "test",
        authorId,
      }),
    ).rejects.toBeInstanceOf(ProjectAlreadyExistsError);
  });
});
