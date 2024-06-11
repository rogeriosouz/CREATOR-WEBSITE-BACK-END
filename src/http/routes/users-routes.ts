import { FastifyInstance } from "fastify";
import { register } from "../controllers/register";
import { authentication } from "../controllers/authentication";
import { logout } from "../controllers/logout";
import { authMiddleware } from "../middlewares/auth";

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
  app.post("/auth/register", register);
  app.post("/auth/login", authentication);
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
