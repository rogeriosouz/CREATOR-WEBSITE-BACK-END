import { env } from "@/env";
import { JwtService } from "@/services/jwt";
import { TokenInvalidError } from "./errors/TokenInvalidError";
import { UsersRepository } from "@/repositories/users-repository";
import { UserNotFoundError } from "./errors/UserNotFoundError";
import { hashPassword } from "@/utils/hashPassword";

interface RecoveryPasswordUseCaseRequest {
  token: string;
  newPassword: string;
}

interface RecoveryPasswordUseCaseResponse {
  message: string;
}

export class RecoveryPasswordUseCase {
  constructor(
    private UsersRepository: UsersRepository,
    private JwtService: JwtService,
  ) {}

  async execute({
    token,
    newPassword,
  }: RecoveryPasswordUseCaseRequest): Promise<RecoveryPasswordUseCaseResponse> {
    const tokenIsValidJwt = await this.JwtService.verify({
      jwtToken: token,
      secret: env.SECRET_TOKEN_FORGOT_PASSWORD,
    });

    if (!tokenIsValidJwt) {
      throw new TokenInvalidError();
    }

    const tokenIsInValidDb =
      await this.UsersRepository.findByInvalidToken(token);

    if (tokenIsInValidDb) {
      throw new TokenInvalidError();
    }

    const user = await this.UsersRepository.findById(tokenIsValidJwt.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const newPasswordHash = await hashPassword(newPassword);

    await this.UsersRepository.recoveryPassword(
      tokenIsValidJwt.userId,
      newPasswordHash,
    );

    await this.UsersRepository.invalidateToken(token);

    return {
      message: "success update password",
    };
  }
}
