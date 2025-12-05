import db from "@/db";
import { ac, roles } from "@/lib/auth/permissions";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { admin, customSession } from "better-auth/plugins";
import { hashPassword, verifyPassword } from "./argon2";
import { normalizeName, VALID_DOMAINS } from "./utils";
const options = {
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8,
		autoSignIn: false,
		password: {
			hash: hashPassword,
			verify: verifyPassword,
		},
		requireEmailVerification: true,
	},
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			if (ctx.path === "/sign-up/email") {
				const email = String(ctx.body.email);
				const domain = email.split("@")[1].toLowerCase();
				if (!VALID_DOMAINS().includes(domain)) {
					throw new APIError("BAD_REQUEST", {
						message: "Invalid domain. Please use a valid email.",
					});
				}
				const name = normalizeName(ctx.body.name);
				return { context: { ...ctx, body: { ...ctx.body, name } } };
			}
			if (ctx.path === "/update-user") {
				const name = normalizeName(ctx.body.name);
				return { context: { ...ctx, body: { ...ctx.body, name } } };
			}
		}),
	},
	databaseHooks: {
		user: {
			create: {
				before: async (user) => {
					const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(";") ?? [];
					if (ADMIN_EMAILS.includes(user.email)) {
						return { data: { ...user, role: "ADMIN" } };
					}
					return { data: user };
				},
			},
		},
	},
	user: {
		additionalFields: {
			role: {
				type: ["ADMIN", "CURATOR", "STAFF", "USER"],
				input: false,
			},
		},
	},
	session: {
		expiresIn: 7 * 24 * 60 * 60,
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60,
		},
	},
	account: {
		accountLinking: {
			enabled: false,
		},
	},
	advanced: {
		database: {
			generateId: false,
		},
	},
	socialProviders: {
		google: {
			clientId: String(process.env.GOOGLE_CLIENT_ID),
			clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
		},
	},
} satisfies BetterAuthOptions;

const customSessionLogic = async ({
	user,
	session,
}: {
	user: any;
	session: any;
}) => {
	return {
		session: {
			expiresAt: session.expiresAt,
			token: session.token,
			userAgent: session.userAgent,
		},
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
			createdAt: user.createdAt,
		},
	};
};
export type CustomClientSession = Awaited<
	ReturnType<typeof customSessionLogic>
> | null;
export const auth = betterAuth({
	...options,
	plugins: [
		nextCookies(),
		admin({
			defaultRole: "USER",
			adminRoles: ["ADMIN"],
			ac,
			roles,
		}),

		customSession(customSessionLogic, options),
	],
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
