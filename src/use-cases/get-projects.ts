import {
  Project,
  ProjectsRepository,
} from "@/repositories/projects-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { UserNotFoundError } from "./errors/UserNotFoundError";

interface GetProjectsUseCaseRequest {
  userId: string;
}

interface GetProjectsUseCaseResponse {
  projects: Project[];
}

export class GetProjectsUseCase {
  constructor(
    private ProjectsRepository: ProjectsRepository,
    private UsersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
  }: GetProjectsUseCaseRequest): Promise<GetProjectsUseCaseResponse> {
    const user = await this.UsersRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const projects = await this.ProjectsRepository.findAllByAuthorId(userId);

    return {
      projects,
    };
  }
}
