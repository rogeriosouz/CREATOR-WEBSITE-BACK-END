import { sql } from "@/lib/postgres";
import {
  CreateProjectRequest,
  Project,
  ProjectsRepository,
  UpdateProjectData,
} from "../projects-repository";

export class PostgresProjectsRepository implements ProjectsRepository {
  async create({ name, authorId }: CreateProjectRequest) {
    const project = await sql/* sql */ `INSERT INTO projects (name, user_id) 
    VALUES (${name}, ${authorId}) RETURNING *;
    `;

    return project[0] as Project;
  }

  async findByName(name: string) {
    const project =
      await sql/* sql */ `SELECT * FROM projects WHERE name = ${name}`;

    if (project.length >= 1) {
      return project[0] as Project;
    }

    return null;
  }

  async findById(id: string) {
    const project =
      await sql/* sql */ `SELECT * FROM projects WHERE id = ${id}`;

    if (project.length >= 1) {
      return project[0] as Project;
    }

    return null;
  }

  async findByAuthorIdAndProjectId(authorId: string, projectId: string) {
    const project =
      await sql/* sql */ `SELECT * FROM projects WHERE id = ${projectId} AND user_id = ${authorId}`;

    if (project.length >= 1) {
      return project[0] as Project;
    }

    return null;
  }

  async update(id: string, data: UpdateProjectData) {
    const project =
      await sql/* sql */ `SELECT * from projects WHERE id = ${id}`;

    const name = data.name ? data.name : (project[0].name as string);
    const html = data.html ? data.html : (project[0].html as string);
    const css = data.css ? data.css : (project[0].css as string);
    const javascript = data.javascript
      ? data.javascript
      : (project[0].javascript as string);

    const newProject = await sql/* sql */ `UPDATE projects 
      SET name = ${name}, html = ${html}, css = ${css}, javascript = ${javascript}, updated_at = DEFAULT 
      WHERE id = ${id} RETURNING *`;

    return newProject[0] as Project;
  }
}
