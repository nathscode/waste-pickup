import { NextResponse } from "next/server";
import { user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import db from "@/db";
import { getAuthenticatedUser } from "@/action/get-authenticated-user";

export async function GET() {
	try {
		const session = await getAuthenticatedUser();

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (session?.user.role !== "ADMIN") {
			return NextResponse.json(
				{ error: "Unauthorized to carry this action" },
				{ status: 401 }
			);
		}
		// Get all users with COLLECTOR role
		const collectors = await db
			.select({
				id: userTable.id,
				name: userTable.name,
				email: userTable.email,
				phone: userTable.phone,
				created_at: userTable.createdAt,
			})
			.from(userTable)
			.where(eq(userTable.role, "COLLECTOR"));

		return NextResponse.json({ collectors });
	} catch (error: any) {
		console.error("Error fetching collectors:", error);

		if (error.message === "Unauthorized" || error.message === "Forbidden") {
			return NextResponse.json(
				{ error: error.message },
				{ status: error.message === "Unauthorized" ? 401 : 403 }
			);
		}

		return NextResponse.json(
			{ error: "Failed to fetch collectors" },
			{ status: 500 }
		);
	}
}
