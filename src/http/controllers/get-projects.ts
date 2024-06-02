import { UserNotFoundError } from "@/use-cases/errors/UserNotFoundError";
import { PostgresProjectsRepository } from "@/repositories/postgres/postgres-projects-repository";
import { CustomAuthMiddlewareFastifyRequest } from "../middlewares/auth";
import { FastifyReply } from "fastify";
import { GetProjectsUseCase } from "@/use-cases/get-projects";
import { PostgresUsersRepository } from "@/repositories/postgres/postgres-users-repository";

export async function getProjects(
  request: CustomAuthMiddlewareFastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.userId as string;

  try {
    const projectsRepository = new PostgresProjectsRepository();
    const usersRepository = new PostgresUsersRepository();
    const getProjectsUseCase = new GetProjectsUseCase(
      projectsRepository,
      usersRepository,
    );

    const { projects } = await getProjectsUseCase.execute({
      userId,
    });

    return reply.status(200).send({
      statusCode: 200,
      projects,
    });
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(404).send({
        statusCode: 404,
        message: err.message,
      });
    }

    throw err;
  }
}
