import { ProjectsRepository } from "@/repositories/projects-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { UserNotFoundError } from "./errors/UserNotFoundError";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";

interface GetProjectUseCaseRequest {
  userId: string;
  projectId: string;
}

interface GetProjectUseCaseResponse {
  project: {
    id: string;
    name: string;
    html: string;
    css: string;
    javascript: string;
  };
}

export class GetProjectUseCase {
  constructor(
    private ProjectsRepository: ProjectsRepository,
    private UsersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    projectId,
  }: GetProjectUseCaseRequest): Promise<GetProjectUseCaseResponse> {
    const user = await this.UsersRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const project = await this.ProjectsRepository.findById(projectId);

    if (!project) {
      throw new ResourceNotFoundError();
    }

    return {
      project: {
        id: project.id,
        name: project.name,
        html: project.html as string,
        css: project.css as string,
        javascript: project.javascript as string,
      },
    };
  }
}
