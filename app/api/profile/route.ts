import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { user, requests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuthenticatedUser } from "@/action/get-authenticated-user";
import db from "@/db";

// GET - Get current user profile
export async function GET() {
	try {
		const session = await getAuthenticatedUser();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const [profile] = await db
			.select({
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				address: user.address,
				phone: user.phone,
				createdAt: user.createdAt,
			})
			.from(user)
			.where(eq(user.id, session?.user.id))
			.limit(1);

		if (!profile) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		return NextResponse.json(profile);
	} catch (error) {
		console.error("Error fetching profile:", error);
		return NextResponse.json(
			{ error: "Failed to fetch profile" },
			{ status: 500 }
		);
	}
}

// PATCH - Update user profile
export async function PATCH(request: Request) {
	try {
		const session = await getAuthenticatedUser();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { name, phone, address } = body;

		// Validate input
		if (!name || name.trim().length === 0) {
			return NextResponse.json({ error: "Name is required" }, { status: 400 });
		}

		// Update user
		const [updatedUser] = await db
			.update(user)
			.set({
				name: name.trim(),
				phone: phone?.trim() || null,
				address: address?.trim() || null,
			})
			.where(eq(user.id, session?.user.id))
			.returning({
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				address: user.address,
				phone: user.phone,
			});

		if (!updatedUser) {
			return NextResponse.json(
				{ error: "Failed to update profile" },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			message: "Profile updated successfully",
			user: updatedUser,
		});
	} catch (error) {
		console.error("Error updating profile:", error);
		return NextResponse.json(
			{ error: "Failed to update profile" },
			{ status: 500 }
		);
	}
}

// DELETE - Delete user account and associated data
export async function DELETE() {
	try {
		const session = await getAuthenticatedUser();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		await db.delete(requests).where(eq(requests.user_id, session?.user.id));

		await db
			.update(requests)
			.set({ collector_id: null })
			.where(eq(requests.collector_id, session?.user.id));

		await db.delete(user).where(eq(user.id, session?.user.id));

		const cookieStore = await cookies();
		cookieStore.delete("token");

		return NextResponse.json({
			message: "Account deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting account:", error);
		return NextResponse.json(
			{ error: "Failed to delete account" },
			{ status: 500 }
		);
	}
}
