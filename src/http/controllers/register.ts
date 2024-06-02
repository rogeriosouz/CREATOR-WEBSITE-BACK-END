import { PostgresUsersRepository } from "@/repositories/postgres/postgres-users-repository";
import { UserAlreadyExistsError } from "@/use-cases/errors/UserAlreadyExistsError";
import { RegisterUseCase } from "@/use-cases/register";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(5),
  });

  const { name, email, password } = registerSchema.parse(request.body);

  try {
    const usersRepository = new PostgresUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    await registerUseCase.execute({
      name,
      email,
      password,
    });

    return reply.status(201).send({
      message: "success register user",
      statusCode: 201,
    });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(400).send({
        statusCode: 400,
        message: err.message,
      });
    }

    throw err;
  }
}
