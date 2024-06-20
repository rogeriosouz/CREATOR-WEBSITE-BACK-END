import { env } from "@/env";
import { createTransport } from "nodemailer";

export const configTest = createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: env.USER_MAILTRAP,
    pass: env.PASS_MAILTRAP,
  },
});
