import { UsersRepository } from "@/repositories/users-repository";
import { UserAlreadyExistsError } from "./errors/UserAlreadyExistsError";
import { hashPassword } from "@/utils/hashPassword";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: {
    id: string;
    name: string;
    email: string;
    rule: string;
  };
}

export class RegisterUseCase {
  constructor(private UsersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const isUser = await this.UsersRepository.findByEmail(email);

    if (isUser) {
      throw new UserAlreadyExistsError();
    }

    const password_hash = await hashPassword(password);

    const user = await this.UsersRepository.create({
      name,
      email,
      password_hash,
      rules: "user",
    });

    return {
      user: {
        id: user.id as string,
        name: user.name,
        email: user.email,
        rule: user.rules,
      },
    };
  }
}
