import { Database } from "./db_schema.ts";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import { Kysely } from "kysely";

export const db = new Kysely<Database>({
  dialect: new PostgresJSDialect({
    postgres: postgres({
      database: "oauth",
      host: "localhost",
      user: "postgres",
      password: "postgres",
      port: 5432,
      max: 10,
    }),
  }),
});
