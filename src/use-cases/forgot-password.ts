import { UsersRepository } from "@/repositories/users-repository";
import { UserNotFoundError } from "./errors/UserNotFoundError";
import { EmailService } from "@/services/email";
import { forgotPasswordEmail } from "@/templates/forgot-password-email";
import { JwtService } from "@/services/jwt";
import { env } from "@/env";

interface ForgotPasswordUseCaseRequest {
  email: string;
}

interface ForgotPasswordUseCaseResponse {
  message: string;
}

export class ForgotPasswordUseCase {
  constructor(
    private UsersRepository: UsersRepository,
    private EmailService: EmailService,
    private JwtService: JwtService,
  ) {}

  async execute({
    email,
  }: ForgotPasswordUseCaseRequest): Promise<ForgotPasswordUseCaseResponse> {
    const user = await this.UsersRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFoundError();
    }

    const { jwt } = await this.JwtService.create({
      secret: env.SECRET_TOKEN_FORGOT_PASSWORD,
      config: {
        expiresIn: "1h",
      },
      payload: {
        userId: user.id,
      },
    });

    const templateForgotPassword = forgotPasswordEmail({
      email,
      message: "Clique no butão abaixo, para redefinir sua senha",
      token: jwt,
      urlApplication: "http://localhost:3000",
    });

    await this.EmailService.sendEmail(email, templateForgotPassword);

    return {
      message: "An email has been sent to your mailbox.",
    };
  }
}
