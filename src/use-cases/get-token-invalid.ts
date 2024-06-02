import { UsersRepository } from "@/repositories/users-repository";

interface GetInvalidTokensUseCaseResponse {
  isTokenValid: boolean;
}

interface GetInvalidTokensUseCaseRequest {
  token: string;
}

export class GetTokenInvalidUseCase {
  constructor(private UsersRepository: UsersRepository) {}

  async execute({
    token,
  }: GetInvalidTokensUseCaseRequest): Promise<GetInvalidTokensUseCaseResponse> {
    const isToken = await this.UsersRepository.findByInvalidToken(token);

    return {
      isTokenValid: !!isToken,
    };
  }
}
