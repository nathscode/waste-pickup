import { NextResponse } from "next/server";
import { feedback, requests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuthenticatedUser } from "@/action/get-authenticated-user";
import db from "@/db";

export async function POST(req: Request) {
	try {
		const session = await getAuthenticatedUser();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const { requestId, rating, comment } = body;

		if (!requestId || !rating) {
			return NextResponse.json({ error: "Missing fields" }, { status: 400 });
		}

		console.log(requestId);

		// Verify request ownership
		const [request] = await db
			.select()
			.from(requests)
			.where(eq(requests.id, requestId))
			.limit(1);

		if (!request) {
			return NextResponse.json({ error: "Request not found" }, { status: 404 });
		}

		if (request.user_id !== session.user.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		// Insert Feedback
		const [newFeedback] = await db
			.insert(feedback)
			.values({
				request_id: requestId,
				rating: parseInt(rating),
				comment: comment || "",
			})
			.returning();

		return NextResponse.json({ feedback: newFeedback });
	} catch (error) {
		console.error("Error submitting feedback:", error);
		return NextResponse.json(
			{ error: "Failed to submit feedback" },
			{ status: 500 }
		);
	}
}

export async function GET() {
	try {
		const session = await getAuthenticatedUser();
		if (!session || session.user.role !== "ADMIN") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		const allFeedback = await db
			.select({
				feedback: feedback,
				request: requests,
			})
			.from(feedback)
			.leftJoin(requests, eq(feedback.request_id, requests.id));

		return NextResponse.json({ feedbacks: allFeedback });
	} catch (error) {
		console.error("Error fetching feedback:", error);
		return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
	}
}
