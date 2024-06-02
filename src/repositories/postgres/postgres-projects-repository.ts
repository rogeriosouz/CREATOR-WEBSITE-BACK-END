import { sql } from "@/lib/postgres";
import {
  CreateProjectRequest,
  Project,
  ProjectsRepository,
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
}
