import { NextResponse } from "next/server";
import { user } from "@/db/schema";
import { desc, eq, not } from "drizzle-orm";
import { getAuthenticatedUser } from "@/action/get-authenticated-user";
import db from "@/db";

export async function GET() {
	try {
		const session = await getAuthenticatedUser();

		// Security Check
		if (!session || session.user.role !== "ADMIN") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		const users = await db
			.select({
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				image: user.image,
				created_at: user.createdAt,
			})
			.from(user)
			.orderBy(desc(user.createdAt));

		return NextResponse.json({ users });
	} catch (error) {
		console.error("Error fetching users:", error);
		return NextResponse.json(
			{ error: "Failed to fetch users" },
			{ status: 500 }
		);
	}
}

// PATCH: Update user role (Admin only)
export async function PATCH(req: Request) {
	try {
		const session = await getAuthenticatedUser();

		// Security Check
		if (!session || session.user.role !== "ADMIN") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		const body = await req.json();
		const { userId, role } = body;

		if (!userId || !role) {
			return NextResponse.json({ error: "Missing fields" }, { status: 400 });
		}

		// Validate role
		const validRoles = ["USER", "COLLECTOR", "ADMIN"];
		if (!validRoles.includes(role)) {
			return NextResponse.json({ error: "Invalid role" }, { status: 400 });
		}

		// Update user
		const [updatedUser] = await db
			.update(user)
			.set({ role })
			.where(eq(user.id, userId))
			.returning();

		return NextResponse.json({ user: updatedUser });
	} catch (error) {
		console.error("Error updating user role:", error);
		return NextResponse.json(
			{ error: "Failed to update user" },
			{ status: 500 }
		);
	}
}
