import { config as dotenvConfig } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd(), true);

export default defineConfig({
	out: "./db/migrations",
	schema: "./db/schema.ts",
	dialect: "postgresql",
	schemaFilter: "public",
	verbose: true,
	strict: true,
	dbCredentials: {
		url: process.env.DATABASE_URL! as string,
	},
});
