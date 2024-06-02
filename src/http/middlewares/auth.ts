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
  const isCookieToken = request.headers.cookie;

  if (!isCookieToken) {
    return reply.status(401).send({
      message: "token invalid",
    });
  }

  const authToken = isCookieToken.replace("authUser=", "");

  const jwtJsonwebtokenService = new JwtJsonwebtokenService();

  const isTokenValid = await jwtJsonwebtokenService.verify({
    jwtToken: authToken,
    secret: env.SECRET_AUTH_USER,
  });

  if (!isTokenValid) {
    return reply.status(401).send({
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
    return reply.status(401).send({
      statusCode: 401,
      message: "token invalid",
    });
  }

  request.userId = isTokenValid.userId;
  request.authUserToken = authToken;
}
