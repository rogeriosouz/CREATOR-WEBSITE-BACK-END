import Fastify from "fastify";
import { usersRoutes } from "./http/routes/users-routes";
import { env } from "./env";
import { projectsRoutes } from "./http/routes/projects-routes";
import fastifyCookie from "@fastify/cookie";
import cors from "@fastify/cors";

const app = Fastify();

app.register(cors, {
  origin: "http://localhost:5173",
  credentials: true,
});

app.register(fastifyCookie, {
  secret: env.SECRET_AUTH_USER,
  parseOptions: {},
});

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
