import { UsersRepository } from "@/repositories/users-repository";
import { UserNotFoundError } from "./errors/UserNotFoundError";

interface LogoutUseCaseRequest {
  userId: string;
  token: string;
}

interface LogoutUseCaseResponse {
  message: string;
}

export class LogoutUseCase {
  constructor(private UsersRepository: UsersRepository) {}

  async execute({
    userId,
    token,
  }: LogoutUseCaseRequest): Promise<LogoutUseCaseResponse> {
    const user = await this.UsersRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    await this.UsersRepository.logOut(token);

    return {
      message: "success logout user",
    };
  }
}
