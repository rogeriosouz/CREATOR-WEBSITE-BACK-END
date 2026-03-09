import { PostgresUsersRepository } from "@/repositories/postgres/postgres-users-repository";
import { JwtJsonwebtokenService } from "@/services/jsonwebtoken/jwt-jsonwebtoken";
import { AuthenticationUseCase } from "@/use-cases/authentication";
import { InvalidCredentialsError } from "@/use-cases/errors/InvalidCredentialsError";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function authentication(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5),
  });

  const { email, password } = registerSchema.parse(request.body);

  try {
    const usersRepository = new PostgresUsersRepository();
    const jwtService = new JwtJsonwebtokenService();
    const authenticationUseCase = new AuthenticationUseCase(
      usersRepository,
      jwtService,
    );

    const { user, token, expiredAt } = await authenticationUseCase.execute({
      email,
      password,
    });

    return reply
      .status(200)
      .setCookie("authUser", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 6,
      })
      .send({
        user,
        expiredAt,
        message: "success authentication user",
        statusCode: 200,
      });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(404).send({
        statusCode: 404,
        message: err.message,
      });
    }

    throw err;
  }
}
