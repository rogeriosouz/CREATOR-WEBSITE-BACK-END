import { PostgresUsersRepository } from "@/repositories/postgres/postgres-users-repository";
import { JwtJsonwebtokenService } from "@/services/jsonwebtoken/jwt-jsonwebtoken";
import { TokenInvalidError } from "@/use-cases/errors/TokenInvalidError";
import { UserNotFoundError } from "@/use-cases/errors/UserNotFoundError";
import { RecoveryPasswordUseCase } from "@/use-cases/recovery-password";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function recoveryPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const recoveryPasswordSchema = z.object({
    token: z.string(),
    newPassword: z.string().min(5),
  });

  const { token, newPassword } = recoveryPasswordSchema.parse(request.body);

  try {
    const usersRepository = new PostgresUsersRepository();
    const jwtService = new JwtJsonwebtokenService();

    const recoveryPasswordUseCase = new RecoveryPasswordUseCase(
      usersRepository,
      jwtService,
    );

    const { message } = await recoveryPasswordUseCase.execute({
      token,
      newPassword,
    });

    return {
      statusCode: 200,
      message,
    };
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(404).send({
        statusCode: 404,
        message: err.message,
      });
    }

    if (err instanceof TokenInvalidError) {
      return reply.status(401).send({
        statusCode: 401,
        message: err.message,
      });
    }

    throw err;
  }
}
