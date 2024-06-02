export type Project = {
  id: string;
  name: string;
  user_id?: string;
};

export type CreateProjectRequest = {
  id?: string;
  name: string;
  authorId: string;
  user_id?: string;
};

export type UpdateProjectData = {
  name?: string;
  html?: string;
  css?: string;
  javascript?: string;
};

export interface ProjectsRepository {
  create(data: CreateProjectRequest): Promise<Project>;
  findByName(name: string): Promise<null | Project>;
  findById(id: string): Promise<null | Project>;
  findByAuthorIdAndProjectId(
    userId: string,
    projectId: string,
  ): Promise<null | Project>;
  update(id: string, data: UpdateProjectData): Promise<Project>;
}
