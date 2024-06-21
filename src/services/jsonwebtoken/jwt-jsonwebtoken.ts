import {
  CreateTypeRequest,
  DecodeTypeRequest,
  JwtService,
  Token,
  VerifyTypeRequest,
} from "../jwt";

import jwt from "jsonwebtoken";

export class JwtJsonwebtokenService implements JwtService {
  async decode({ token }: DecodeTypeRequest) {
    const tokenJwt = jwt.decode(token) as Token;

    return tokenJwt;
  }

  async verify({ jwtToken, secret }: VerifyTypeRequest) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token: any = jwt.verify(jwtToken, secret);

      return {
        userId: token.userId ? token.userId : token.user.id,
      };
    } catch (error) {
      return null;
    }
  }

  async create({ secret, payload, config }: CreateTypeRequest) {
    const token = jwt.sign(payload, secret, config);

    return { jwt: token };
  }
}
