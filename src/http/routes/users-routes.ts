import { FastifyInstance } from "fastify";
import { register } from "../controllers/register";
import { authentication } from "../controllers/authentication";
import { logout } from "../controllers/logout";
import { authMiddleware } from "../middlewares/auth";
import fastifyRateLimit from "@fastify/rate-limit";
import { forgotPassword } from "../controllers/forgot-password";
import { recoveryPassword } from "../controllers/recovery-password";

// app.delete(
//   "/auth/logout",
//   {
//     preHandler: (request, reply) => {
//       return authMiddleware({
//         request,
//         reply,
//         isAdm: false,
//       });
//     },
//   },

//   logOut,
// );

export async function usersRoutes(app: FastifyInstance) {
  await app.register(fastifyRateLimit, {
    max: 5,
    timeWindow: "1 minute",
  });

  app.post("/auth/register", register);
  app.post("/auth/login", authentication);
  app.post("/auth/forgot-password", forgotPassword);
  app.post("/auth/recovery-password", recoveryPassword);

  app.get(
    "/auth/logout",
    {
      preHandler: (request, reply) => {
        return authMiddleware({
          request,
          reply,
          isAdm: false,
        });
      },
    },
    logout,
  );
}
