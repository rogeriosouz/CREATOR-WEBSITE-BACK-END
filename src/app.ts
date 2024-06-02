import Fastify from "fastify";
import { usersRoutes } from "./http/routes/users-routes";
import { env } from "./env";
import { projectsRoutes } from "./http/routes/projects-routes";

const app = Fastify();

app.setErrorHandler((error, _, reply) => {
  if (error.name === "ZodError") {
    return reply.status(400).send({
      statusCode: 400,
      message: "Error validation",
      error: JSON.parse(error.message),
    });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  }

  throw error;
});

app.register(usersRoutes);
app.register(projectsRoutes);

export { app };
