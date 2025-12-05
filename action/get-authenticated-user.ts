"use server";

import { auth, CustomClientSession } from "@/lib/auth";
import { headers } from "next/headers";

export async function getAuthenticatedUser(): Promise<CustomClientSession | null> {
	try {
		const headersList = await headers();
		const session = await auth.api.getSession({
			headers: headersList,
		});
		if (!session?.user) {
			return null;
		}

		return session;
	} catch (error) {
		console.error("Error fetching current user:", error);
		return null;
	}
}
