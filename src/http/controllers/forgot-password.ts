import { PostgresUsersRepository } from "@/repositories/postgres/postgres-users-repository";
import { JwtJsonwebtokenService } from "@/services/jsonwebtoken/jwt-jsonwebtoken";
import { EmailNodemailerService } from "@/services/nodemailer/email-nodemailer";
import { UserNotFoundError } from "@/use-cases/errors/UserNotFoundError";
import { ForgotPasswordUseCase } from "@/use-cases/forgot-password";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function forgotPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const forgotPasswordSchema = z.object({
    email: z.string().email(),
  });

  const { email } = forgotPasswordSchema.parse(request.body);

  try {
    const usersRepository = new PostgresUsersRepository();
    const emailService = new EmailNodemailerService();
    const jwtService = new JwtJsonwebtokenService();

    const forgotPassword = new ForgotPasswordUseCase(
      usersRepository,
      emailService,
      jwtService,
    );

    const { message } = await forgotPassword.execute({
      email,
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

    throw err;
  }
}
