import { NextResponse } from "next/server";
import { requests } from "@/db/schema";
import { eq } from "drizzle-orm";
import db from "@/db";
import { getAuthenticatedUser } from "@/action/get-authenticated-user";

export async function POST(request: Request) {
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
		const body = await request.json();
		const { request_id, collector_id } = body;

		if (!request_id || !collector_id) {
			return NextResponse.json(
				{ error: "Request ID and Collector ID are required" },
				{ status: 400 }
			);
		}

		// Update the request
		const [updatedRequest] = await db
			.update(requests)
			.set({
				collector_id,
				status: "assigned",
				updated_at: new Date(),
			})
			.where(eq(requests.id, request_id))
			.returning();

		if (!updatedRequest) {
			return NextResponse.json({ error: "Request not found" }, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			request: updatedRequest,
		});
	} catch (error: any) {
		console.error("Error assigning collector:", error);

		if (error.message === "Unauthorized" || error.message === "Forbidden") {
			return NextResponse.json(
				{ error: error.message },
				{ status: error.message === "Unauthorized" ? 401 : 403 }
			);
		}

		return NextResponse.json(
			{ error: "Failed to assign collector" },
			{ status: 500 }
		);
	}
}
