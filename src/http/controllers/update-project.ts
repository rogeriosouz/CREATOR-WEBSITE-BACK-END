import { PostgresProjectsRepository } from "@/repositories/postgres/postgres-projects-repository";
import { ResourceNotFoundError } from "@/use-cases/errors/ResourceNotFoundError";
import { UpdateProjectUseCase } from "@/use-cases/update-project";
import { CustomAuthMiddlewareFastifyRequest } from "../middlewares/auth";
import { FastifyReply } from "fastify";
import { z } from "zod";

export async function updateProject(
  request: CustomAuthMiddlewareFastifyRequest,
  reply: FastifyReply,
) {
  const registerSchemaParams = z.object({
    id: z.string().uuid(),
  });

  const registerSchemaBody = z.object({
    name: z.string().optional(),
    html: z.string().optional(),
    css: z.string().optional(),
    javascript: z.string().optional(),
  });

  const { id } = registerSchemaParams.parse(request.params);
  const data = registerSchemaBody.parse(request.body);

  const userId = request.userId as string;

  try {
    const projectRepository = new PostgresProjectsRepository();
    const updateProjectUseCase = new UpdateProjectUseCase(projectRepository);

    await updateProjectUseCase.execute({
      userId,
      projectId: id,
      data,
    });

    return reply.status(200).send({
      message: "success update Project",
      statusCode: 200,
    });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(400).send({
        statusCode: 400,
        message: err.message,
      });
    }

    throw err;
  }
}
