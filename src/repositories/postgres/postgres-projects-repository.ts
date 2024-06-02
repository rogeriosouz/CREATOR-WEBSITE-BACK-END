import { sql } from "@/lib/postgres";
import {
  CreateProjectRequest,
  Project,
  ProjectsRepository,
} from "../projects-repository";

export class PostgresProjectRepository implements ProjectsRepository {
  async create({ name, authorId }: CreateProjectRequest) {
    const project = await sql/* sql */ `INSERT INTO projects (name, user_id) 
    VALUES (${name}, ${authorId}) RETURNING *;
    `;

    return project[0] as Project;
  }
}
