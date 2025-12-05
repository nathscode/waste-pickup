import type { auth } from "@/lib/auth";
import { ac, roles } from "@/lib/auth/permissions";
import {
	adminClient,
	customSessionClient,
	inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	plugins: [
		inferAdditionalFields<typeof auth>(),
		adminClient({ ac, roles }),
		customSessionClient<typeof auth>(),
	],
});

export const { signIn, signUp, signOut, useSession, admin, updateUser } =
	authClient;
