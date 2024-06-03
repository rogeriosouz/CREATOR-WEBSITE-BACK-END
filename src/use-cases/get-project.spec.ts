import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryProjectsRepository } from "@/repositories/in-memory/in-memory-projects-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { GetProjectUseCase } from "./get-project";
import { UserNotFoundError } from "./errors/UserNotFoundError";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";

let inMemoryProjectsRepository: InMemoryProjectsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: GetProjectUseCase;

describe("get project use case", async () => {
  beforeEach(() => {
    inMemoryProjectsRepository = new InMemoryProjectsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new GetProjectUseCase(
      inMemoryProjectsRepository,
      inMemoryUsersRepository,
    );
  });

  it("should be possible to list project", async () => {
    const userId = "id test";

    const projectId = "id test";

    inMemoryUsersRepository.create({
      id: userId,
      name: "test",
      email: "test@gmail.com",
      password_hash: "hash",
      rules: "user",
    });

    inMemoryProjectsRepository.create({
      id: projectId,
      authorId: userId,
      name: "name test",
    });

    const { project } = await sut.execute({
      projectId,
      userId,
    });

    expect(project.id).toEqual(expect.any(String));
  });

  it("should not be possible to list a project with a non-existent user", async () => {
    const userId = "id test";
    const projectId = "id test";

    inMemoryProjectsRepository.create({
      id: projectId,
      authorId: userId,
      name: "name test",
    });

    expect(() =>
      sut.execute({
        projectId,
        userId,
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it("should not be possible to list a project with a non-existent project", async () => {
    const userId = "id test";
    const projectId = "id test";

    inMemoryUsersRepository.create({
      id: userId,
      name: "test",
      email: "test@gmail.com",
      password_hash: "hash",
      rules: "user",
    });

    expect(() =>
      sut.execute({
        projectId,
        userId,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
