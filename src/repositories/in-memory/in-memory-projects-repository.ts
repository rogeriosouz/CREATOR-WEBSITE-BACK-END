import { randomUUID } from "node:crypto";
import {
  CreateProjectRequest,
  Project,
  ProjectsRepository,
  UpdateProjectData,
} from "../projects-repository";

export class InMemoryProjectsRepository implements ProjectsRepository {
  public project = [] as Project[];

  async create(data: CreateProjectRequest) {
    const id = data.id ? data.id : randomUUID();

    const project = {
      id,
      ...data,
    };

    this.project.push(project);

    return project;
  }

  async findAllByAuthorId(authorId: string) {
    const project = this.project.filter((item) => item.user_id === authorId);

    return project || [];
  }

  async findByName(name: string) {
    const project = this.project.find((item) => item.name === name);

    if (project) {
      return project;
    }

    return null;
  }

  async findById(id: string) {
    const project = this.project.find((item) => item.id === id);

    if (project) {
      return project;
    }

    return null;
  }

  async findByAuthorIdAndProjectId(authorId: string, projectId: string) {
    const project = this.project.find(
      (item) => item.id === projectId && item.user_id === authorId,
    );

    if (project) {
      return project;
    }

    return null;
  }

  async update(id: string, data: UpdateProjectData) {
    const bookByUserId = this.project.find((item) => item.id === id);
    const name = data.name ? data.name : (bookByUserId?.name as string);

    const newProject: Project = {
      id: bookByUserId?.id as string,
      name,
    };

    this.project = [newProject];

    return newProject;
  }
}
