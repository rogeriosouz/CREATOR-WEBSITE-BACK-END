export type Project = {
  id: string;
  name: string;
};

export type CreateProjectRequest = {
  name: string;
  authorId: string;
};

export interface ProjectsRepository {
  create(data: CreateProjectRequest): Promise<Project>;
  findByName(name: string): Promise<null | Project>;
}
