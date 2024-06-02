import { sql } from "./lib/postgres";

async function setup() {
  await sql/* sql */ `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql/* sql */ `CREATE TYPE rule AS ENUM ('adm', 'user')`;

  await sql/* sql */ `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255),
      email TEXT NOT NULL UNIQUE,
      password_hash VARCHAR(255),
      rules rule DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
   `;

  await sql/* sql */ `
    CREATE TABLE IF NOT EXISTS invalid_tokens (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      token VARCHAR(255) NOT NULL
    ) 
  `;

  await sql/* sql */ `
    CREATE TABLE IF NOT EXISTS projects (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255),
      html VARCHAR(4000),
      css VARCHAR(4000),
      javascript VARCHAR(4000),

      user_id UUID NOT NULL UNIQUE,
      FOREIGN KEY (user_id) REFERENCES users(id),

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
    )
   `;

  await sql.end();

  console.log("Setup success..");
}

setup();
