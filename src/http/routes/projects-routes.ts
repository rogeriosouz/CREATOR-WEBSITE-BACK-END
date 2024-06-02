import { FastifyInstance } from "fastify";
import { createProject } from "../controllers/create-project";
import { authMiddleware } from "../middlewares/auth";
import { updateProject } from "../controllers/update-project";

export async function projectsRoutes(app: FastifyInstance) {
  app.post(
    "/projects",
    {
      preHandler: (request, reply) => {
        return authMiddleware({
          request,
          reply,
          isAdm: false,
        });
      },
    },
    createProject,
  );

  app.put(
    "/projects/:id",
    {
      preHandler: (request, reply) => {
        return authMiddleware({
          request,
          reply,
          isAdm: false,
        });
      },
    },
    updateProject,
  );
}
