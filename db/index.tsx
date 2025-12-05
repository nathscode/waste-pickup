import "dotenv/config";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

if (typeof window !== "undefined") {
	throw new Error("Database configuration should not run on the client!");
}

declare global {
	var dbPool: Pool | undefined;
}
const pool =
	globalThis.dbPool ||
	new Pool({
		connectionString: process.env.DATABASE_URL!,
	});

if (process.env.NODE_ENV !== "production") {
	globalThis.dbPool = pool;
}

const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });
export type db = typeof db;
export default db;
