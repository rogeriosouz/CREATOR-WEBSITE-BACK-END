import { FastifyReply, FastifyRequest } from "fastify";
import { JwtJsonwebtokenService } from "../../services/jsonwebtoken/jwt-jsonwebtoken";
import { env } from "../../env";
import { GetTokenInvalidUseCase } from "@/use-cases/get-token-invalid";
import { PostgresUsersRepository } from "@/repositories/postgres/postgres-users-repository";

export interface CustomAuthMiddlewareFastifyRequest extends FastifyRequest {
  userId?: string;
  authUserToken?: string;
}

interface AuthMiddlewareRequest {
  request: CustomAuthMiddlewareFastifyRequest;
  reply: FastifyReply;
  isAdm: boolean;
}

export async function authMiddleware({
  request,
  reply,
  isAdm,
}: AuthMiddlewareRequest) {
  const authToken = request.cookies.authUser;

  if (!authToken) {
    return reply.status(401).send({
      statusCode: 401,
      message: "token invalid",
    });
  }

  const jwtJsonwebtokenService = new JwtJsonwebtokenService();

  const isTokenValid = await jwtJsonwebtokenService.verify({
    jwtToken: authToken,
    secret: env.SECRET_AUTH_USER,
  });

  if (!isTokenValid) {
    const cookie =
      "authUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=None; HttpOnly";

    return reply
      .status(401)
      .headers({
        "set-cookie": cookie,
      })
      .send({
        statusCode: 401,
        message: "token invalid",
      });
  }

  const usersRepository = new PostgresUsersRepository();

  const { rules } = await usersRepository.findById(isTokenValid.userId);

  if (isAdm) {
    if (rules !== "adm") {
      return reply.status(401).send({
        statusCode: 401,
        message: "user unauthorized",
      });
    }
  }

  const getTokenInvalidUseCase = new GetTokenInvalidUseCase(usersRepository);

  const { isTokenValid: isTokenValidDb } = await getTokenInvalidUseCase.execute(
    {
      token: authToken,
    },
  );

  if (isTokenValidDb) {
    const cookie =
      "authUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=None; HttpOnly";

    return reply
      .status(401)
      .headers({
        "set-cookie": cookie,
      })
      .send({
        statusCode: 401,
        message: "token invalid",
      });
  }

  request.userId = isTokenValid.userId;
  request.authUserToken = authToken;
}
