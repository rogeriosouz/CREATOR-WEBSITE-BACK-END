import { SignOptions } from "jsonwebtoken";

export type CreateTypeRequest = {
  payload: string | object | Buffer;
  secret: string;
  config: Partial<SignOptions> | undefined;
};

export type VerifyTypeRequest = {
  jwtToken: string;
  secret: string;
};

export type DecodeTypeRequest = {
  token: string;
};

export type Token = {
  id: string;
  name: string;
  email: string;
  exp: number;
  iat: number;
};

export interface JwtService {
  create({
    secret,
    payload,
    config,
  }: CreateTypeRequest): Promise<{ jwt: string }>;

  verify({
    jwtToken,
    secret,
  }: VerifyTypeRequest): Promise<{ userId: string } | null>;

  decode({ token }: DecodeTypeRequest): Promise<Token>;
}
