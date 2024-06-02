import { randomUUID } from "node:crypto";
import {
  CreateProjectRequest,
  Project,
  ProjectsRepository,
} from "../projects-repository";

export class InMemoryProjectsRepository implements ProjectsRepository {
  public project = [] as Project[];

  async create(data: CreateProjectRequest) {
    const id = randomUUID();

    const project = {
      id,
      ...data,
    };

    this.project.push(project);

    return project;
  }

  async findByName(name: string) {
    const project = this.project.find((item) => item.name === name);

    if (project) {
      return project;
    }

    return null;
  }
}
