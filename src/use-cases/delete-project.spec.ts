import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryProjectsRepository } from "@/repositories/in-memory/in-memory-projects-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { DeleteProjectUseCase } from "./delete-project";
import { UserNotFoundError } from "./errors/UserNotFoundError";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";

let inMemoryProjectsRepository: InMemoryProjectsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: DeleteProjectUseCase;

describe("create project use case", async () => {
  beforeEach(() => {
    inMemoryProjectsRepository = new InMemoryProjectsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new DeleteProjectUseCase(
      inMemoryProjectsRepository,
      inMemoryUsersRepository,
    );
  });

  it("should be possible to delete project", async () => {
    const authorId = "id test";
    const projectId = "id test project";

    inMemoryUsersRepository.create({
      id: authorId,
      name: "test",
      email: "test@gmail.com",
      password_hash: "hash",
      rules: "user",
    });

    inMemoryProjectsRepository.create({
      id: projectId,
      name: "project test",
      authorId,
      user_id: authorId,
    });

    const { message } = await sut.execute({
      projectId,
      userId: authorId,
    });

    expect(message).toEqual(expect.any(String));
  });

  it("should be possible to delete project", async () => {
    const authorId = "id test";
    const projectId = "id test project";

    inMemoryUsersRepository.create({
      id: authorId,
      name: "test",
      email: "test@gmail.com",
      password_hash: "hash",
      rules: "user",
    });

    inMemoryProjectsRepository.create({
      id: projectId,
      name: "project test",
      authorId,
      user_id: authorId,
    });

    const { message } = await sut.execute({
      projectId,
      userId: authorId,
    });

    expect(message).toEqual(expect.any(String));
  });

  it("should not be possible to delete a project if the user is non-existent", async () => {
    const authorId = "id test";
    const projectId = "id test project";

    inMemoryProjectsRepository.create({
      id: projectId,
      name: "project test",
      authorId,
      user_id: authorId,
    });

    await expect(() =>
      sut.execute({
        projectId,
        userId: authorId,
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it("should not be possible to delete the project with the unknown project id", async () => {
    const projectId = "id test";
    const authorId = "id test";

    inMemoryUsersRepository.create({
      id: authorId,
      name: "test",
      email: "test@gmail.com",
      password_hash: "hash",
      rules: "user",
    });

    await expect(() =>
      sut.execute({
        projectId,
        userId: authorId,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be possible to update if the author is different from the user", async () => {
    const authorId = "author id";
    const projectId = "id test";

    inMemoryUsersRepository.create({
      id: authorId,
      name: "test",
      email: "test@gmail.com",
      password_hash: "hash",
      rules: "user",
    });

    inMemoryProjectsRepository.create({
      id: projectId,
      name: "name test",
      user_id: "different author id",
      authorId,
    });

    await expect(() =>
      sut.execute({
        projectId,
        userId: authorId,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
