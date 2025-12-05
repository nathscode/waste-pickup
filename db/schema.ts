import {
	pgTable,
	serial,
	text,
	varchar,
	integer,
	boolean,
	timestamp,
	pgEnum,
	uniqueIndex,
	index,
} from "drizzle-orm/pg-core";
import { cuid2 } from "drizzle-cuid2/postgres";

export const statusEnum = pgEnum("status", [
	"pending",
	"assigned",
	"in_progress",
	"completed",
	"cancelled",
]);

export const user = pgTable(
	"user",
	{
		id: cuid2("id").defaultRandom().primaryKey(),
		name: text("name").notNull(),
		username: text("username").unique(),
		email: text("email").notNull().unique(),
		phone: text("phone").unique(),
		address: text("address"),
		emailVerified: boolean("email_verified").default(false).notNull(),
		image: text("image"),

		role: text("role", {
			enum: ["ADMIN", "COLLECTOR", "USER"],
		}).default("USER"),

		banned: boolean("banned").default(false).notNull(),
		banReason: text("ban_reason"),
		banExpires: timestamp("ban_expires", { withTimezone: true }),

		isActive: boolean("is_active").default(true).notNull(),
		lastLoginAt: timestamp("last_login_at", { withTimezone: true }),

		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		deletedAt: timestamp("deleted_at", { withTimezone: true }),
	},
	(table) => ({
		emailIdx: uniqueIndex("user_email_idx").on(table.email),
		activeUsersIdx: index("active_users_idx").on(
			table.isActive,
			table.deletedAt
		),
		bannedIdx: index("user_banned_idx").on(table.banned),
	})
);

export const session = pgTable(
	"session",
	{
		id: cuid2("id").defaultRandom().primaryKey(),
		token: text("token").notNull().unique(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),

		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => ({
		userIdIdx: index("session_user_id_idx").on(table.userId),
		expiresAtIdx: index("session_expires_at_idx").on(table.expiresAt),
	})
);

export const account = pgTable(
	"account",
	{
		id: cuid2("id").defaultRandom().primaryKey(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at", {
			withTimezone: true,
		}),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
			withTimezone: true,
		}),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => ({
		userProviderIdx: uniqueIndex("account_user_provider_idx").on(
			table.userId,
			table.providerId
		),
		accountIdIdx: index("account_account_id_idx").on(table.accountId),
	})
);

export const verification = pgTable(
	"verification",
	{
		id: cuid2("id").defaultRandom().primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => ({
		identifierIdx: index("verification_identifier_idx").on(table.identifier),
		expiresAtIdx: index("verification_expires_at_idx").on(table.expiresAt),
	})
);

export const requests = pgTable("requests", {
	id: cuid2("id").defaultRandom().primaryKey(),
	user_id: text("user_id")
		.references(() => user.id)
		.notNull(),
	collector_id: text("collector_id").references(() => user.id),
	waste_type: varchar("waste_type", { length: 100 }).notNull(),
	pickup_address: text("pickup_address").notNull(),
	preferred_time: timestamp("preferred_time"),
	status: statusEnum("status").notNull().default("pending"),
	notes: text("notes"),
	created_at: timestamp("created_at").defaultNow().notNull(),
	updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const feedback = pgTable("feedback", {
	id: cuid2("id").defaultRandom().primaryKey(),
	request_id: text("request_id")
		.references(() => requests.id)
		.notNull(),
	rating: integer("rating").notNull(),
	comment: text("comment"),
	created_at: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Request = typeof requests.$inferSelect;
export type NewRequest = typeof requests.$inferInsert;
export type Feedback = typeof feedback.$inferSelect;
export type NewFeedback = typeof feedback.$inferInsert;
