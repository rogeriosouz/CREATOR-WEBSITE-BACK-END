import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryProjectsRepository } from "@/repositories/in-memory/in-memory-projects-repository";
import { UpdateProjectUseCase } from "./update-project";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";

let inMemoryProjectsRepository: InMemoryProjectsRepository;

let sut: UpdateProjectUseCase;

describe("update project use case", async () => {
  beforeEach(() => {
    inMemoryProjectsRepository = new InMemoryProjectsRepository();
    sut = new UpdateProjectUseCase(inMemoryProjectsRepository);
  });

  it("should be possible to update the project", async () => {
    const projectId = "id test";
    const authorId = "id user test";

    inMemoryProjectsRepository.create({
      id: projectId,
      authorId: projectId,
      name: "name test",
      user_id: authorId,
    });

    const name = "new name test";

    const { project } = await sut.execute({
      userId: authorId,
      projectId,
      data: {
        name,
      },
    });

    expect(project.name).toEqual(name);
  });

  it("should not be possible to update the project with the unknown project id", async () => {
    const projectId = "id test";
    const name = "new name test";

    await expect(() =>
      sut.execute({
        userId: "id user test",
        projectId,
        data: {
          name,
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be possible to update if the author is different from the user", async () => {
    const authorId = "author id";

    inMemoryProjectsRepository.create({
      id: "id project",
      name: "name test",
      user_id: "different author id",
      authorId,
    });

    await expect(() =>
      sut.execute({
        projectId: "id project",
        userId: authorId,
        data: {
          name: "name test",
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
