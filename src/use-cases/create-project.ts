import {
  Project,
  ProjectsRepository,
} from "@/repositories/projects-repository";
import { ProjectAlreadyExistsError } from "./errors/ProjectAlreadyExistsError";
import { UsersRepository } from "@/repositories/users-repository";
import { UserNotFoundError } from "./errors/UserNotFoundError";

interface CreateProjectUseCaseRequest {
  name: string;
  authorId: string;
}
interface CreateProjectUseCaseResponse {
  project: Project;
}

export class CreateProjectUseCase {
  constructor(
    private ProjectsRepository: ProjectsRepository,
    private UsersRepository: UsersRepository,
  ) {}

  async execute({
    name,
    authorId,
  }: CreateProjectUseCaseRequest): Promise<CreateProjectUseCaseResponse> {
    const author = await this.UsersRepository.findById(authorId);

    if (!author) {
      throw new UserNotFoundError();
    }

    const isProject = await this.ProjectsRepository.findByName(name);

    if (isProject) {
      throw new ProjectAlreadyExistsError();
    }

    const project = await this.ProjectsRepository.create({
      name,
      authorId,
    });

    return {
      project,
    };
  }
}
