import { FastifyInstance } from "fastify";
import { createProject } from "../controllers/create-project";
import { authMiddleware } from "../middlewares/auth";
import { updateProject } from "../controllers/update-project";
import { getProjects } from "../controllers/get-projects";
import { getProject } from "../controllers/get-project";

export async function projectsRoutes(app: FastifyInstance) {
  app.get(
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
    getProjects,
  );

  app.get(
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
    getProject,
  );

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
