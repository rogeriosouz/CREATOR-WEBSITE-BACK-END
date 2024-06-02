import { UsersRepository } from "@/repositories/users-repository";
import { verifyPasswordHash } from "@/utils/verifyPasswordHash";
import { InvalidCredentialsError } from "./errors/InvalidCredentialsError";
import { JwtService } from "@/services/jwt";
import { env } from "@/env";

interface AuthenticationUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticationUseCaseResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  expiredAt: string;
}

export class AuthenticationUseCase {
  constructor(
    private UsersRepository: UsersRepository,
    private JwtService: JwtService,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticationUseCaseRequest): Promise<AuthenticationUseCaseResponse> {
    const user = await this.UsersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordVerify = await verifyPasswordHash(
      password,
      user.password_hash,
    );

    if (!passwordVerify) {
      throw new InvalidCredentialsError();
    }

    const payload = {
      user: {
        id: user.id as string,
        name: user.name,
        email: user.email,
      },
    };

    const { jwt } = await this.JwtService.create({
      secret: env.SECRET_AUTH_USER,
      config: {
        expiresIn: "6d",
      },
      payload,
    });

    const token = await this.JwtService.decode({ token: jwt });

    const timestamp = token.exp;
    const date = new Date(timestamp * 1000);
    const dateString = date.toISOString();

    return {
      token: jwt,
      user: {
        id: user.id as string,
        name: user.name,
        email: user.email,
      },
      expiredAt: dateString,
    };
  }
}
