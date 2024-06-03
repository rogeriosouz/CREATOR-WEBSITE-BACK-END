import { ProjectsRepository } from "@/repositories/projects-repository";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { UsersRepository } from "@/repositories/users-repository";
import { UserNotFoundError } from "./errors/UserNotFoundError";

interface DeleteProjectUseCaseRequest {
  userId: string;
  projectId: string;
}

interface DeleteProjectUseCaseResponse {
  message: string;
}

export class DeleteProjectUseCase {
  constructor(
    private ProjectsRepository: ProjectsRepository,
    private UsersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    projectId,
  }: DeleteProjectUseCaseRequest): Promise<DeleteProjectUseCaseResponse> {
    const user = await this.UsersRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const project = await this.ProjectsRepository.findByAuthorIdAndProjectId(
      userId,
      projectId,
    );

    if (!project) {
      throw new ResourceNotFoundError();
    }

    await this.ProjectsRepository.delete(projectId);

    return {
      message: "delete project success",
    };
  }
}
