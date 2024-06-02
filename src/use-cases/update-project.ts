import {
  Project,
  ProjectsRepository,
  UpdateProjectData,
} from "@/repositories/projects-repository";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";

interface UpdateProjectUseCaseRequest {
  userId: string;
  projectId: string;
  data: UpdateProjectData;
}

interface UpdateProjectUseCaseResponse {
  project: Project;
}

export class UpdateProjectUseCase {
  constructor(private ProjectsRepository: ProjectsRepository) {}

  async execute({
    userId,
    projectId,
    data,
  }: UpdateProjectUseCaseRequest): Promise<UpdateProjectUseCaseResponse> {
    const isProject = await this.ProjectsRepository.findByAuthorIdAndProjectId(
      userId,
      projectId,
    );

    if (!isProject) {
      throw new ResourceNotFoundError();
    }

    const project = await this.ProjectsRepository.update(projectId, data);

    return {
      project,
    };
  }
}
