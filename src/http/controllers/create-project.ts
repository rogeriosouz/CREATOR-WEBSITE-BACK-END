import { PostgresUsersRepository } from "@/repositories/postgres/postgres-users-repository";
import { ProjectAlreadyExistsError } from "@/use-cases/errors/ProjectAlreadyExistsError";
import { UserNotFoundError } from "@/use-cases/errors/UserNotFoundError";
import { PostgresProjectsRepository } from "@/repositories/postgres/postgres-projects-repository";
import { CreateProjectUseCase } from "@/use-cases/create-project";
import { CustomAuthMiddlewareFastifyRequest } from "../middlewares/auth";
import { FastifyReply } from "fastify";
import { z } from "zod";

export async function createProject(
  request: CustomAuthMiddlewareFastifyRequest,
  reply: FastifyReply,
) {
  const registerSchema = z.object({
    name: z.string().min(3),
  });

  const { name } = registerSchema.parse(request.body);
  const userId = request.userId as string;

  try {
    const usersRepository = new PostgresUsersRepository();
    const projectsRepository = new PostgresProjectsRepository();

    const createProjectUseCase = new CreateProjectUseCase(
      projectsRepository,
      usersRepository,
    );

    await createProjectUseCase.execute({
      name,
      authorId: userId,
    });

    return reply.status(201).send({
      message: "success create project",
      statusCode: 201,
    });
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(404).send({
        statusCode: 404,
        message: err.message,
      });
    }

    if (err instanceof ProjectAlreadyExistsError) {
      return reply.status(404).send({
        statusCode: 404,
        message: err.message,
      });
    }

    throw err;
  }
}
