import { FastifyInstance } from "fastify";
import { register } from "../controllers/register";
import { authentication } from "../controllers/authentication";

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
}
