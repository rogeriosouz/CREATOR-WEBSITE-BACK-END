import { PostgresUsersRepository } from "@/repositories/postgres/postgres-users-repository";
import { UserNotFoundError } from "@/use-cases/errors/UserNotFoundError";
import { PostgresProjectsRepository } from "@/repositories/postgres/postgres-projects-repository";
import { CustomAuthMiddlewareFastifyRequest } from "../middlewares/auth";
import { GetProjectUseCase } from "@/use-cases/get-project";
import { ResourceNotFoundError } from "@/use-cases/errors/ResourceNotFoundError";
import { FastifyReply } from "fastify";
import { z } from "zod";

export async function getProject(
  request: CustomAuthMiddlewareFastifyRequest,
  reply: FastifyReply,
) {
  const registerSchemaParams = z.object({
    id: z.string().uuid(),
  });

  const { id } = registerSchemaParams.parse(request.params);
  const userId = request.userId as string;

  try {
    const usersRepository = new PostgresUsersRepository();
    const projectsRepository = new PostgresProjectsRepository();

    const createProjectUseCase = new GetProjectUseCase(
      projectsRepository,
      usersRepository,
    );

    const { project } = await createProjectUseCase.execute({
      projectId: id,
      userId,
    });

    return reply.status(200).send({
      statusCode: 200,
      project,
    });
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(404).send({
        statusCode: 404,
        message: err.message,
      });
    }

    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        statusCode: 404,
        message: err.message,
      });
    }

    throw err;
  }
}
