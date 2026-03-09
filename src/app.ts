import Fastify from "fastify";
import { usersRoutes } from "./http/routes/users-routes";
import { env } from "./env";
import { projectsRoutes } from "./http/routes/projects-routes";
import fastifyCookie from "@fastify/cookie";
import cors from "@fastify/cors";

const app = Fastify();

app.register(cors, {
  origin: env.FRONT_END_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
});

app.register(fastifyCookie, {
  secret: env.SECRET_AUTH_USER,
  parseOptions: {},
});

app.setErrorHandler((err, _, reply) => {
  const error = err as unknown as any;

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
