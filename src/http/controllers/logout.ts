import { PostgresUsersRepository } from "@/repositories/postgres/postgres-users-repository";
import { FastifyReply } from "fastify";
import { CustomAuthMiddlewareFastifyRequest } from "../middlewares/auth";
import { LogoutUseCase } from "@/use-cases/logout";
import { UserNotFoundError } from "@/use-cases/errors/UserNotFoundError";

export async function logout(
  request: CustomAuthMiddlewareFastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.userId as string;
  const token = request.authUserToken as string;

  try {
    const usersRepository = new PostgresUsersRepository();
    const logoutUseCase = new LogoutUseCase(usersRepository);

    const { message } = await logoutUseCase.execute({
      token,
      userId,
    });

    const cookie =
      "authUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=None; HttpOnly";

    return reply
      .status(200)
      .headers({
        "set-cookie": cookie,
      })
      .send({
        message,
        statusCode: 200,
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
