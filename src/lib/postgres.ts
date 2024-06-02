import { env } from "@/env";
import postgres from "postgres";

export const sql = postgres(env.DATABASE_URL);
