import { NextResponse } from "next/server";
import { requests, user } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getAuthenticatedUser } from "@/action/get-authenticated-user";
import db from "@/db";

// GET - List all requests for current user
export async function GET() {
	try {
		const session = await getAuthenticatedUser();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userRequests = await db
			.select({
				request: requests,
				collector: user,
			})
			.from(requests)
			.leftJoin(user, eq(requests.collector_id, session?.user.id))
			.where(eq(requests.user_id, session?.user.id))
			.orderBy(desc(requests.created_at));

		const formattedRequests = userRequests.map(({ request, collector }) => ({
			...request,
			collector,
		}));

		return NextResponse.json({ requests: formattedRequests });
	} catch (error) {
		console.error("Error fetching requests:", error);
		return NextResponse.json(
			{ error: "Failed to fetch requests" },
			{ status: 500 }
		);
	}
}

// POST - Create new request
export async function POST(request: Request) {
	try {
		const session = await getAuthenticatedUser();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { waste_type, pickup_address, preferred_time, notes } = body;

		if (!waste_type || !pickup_address) {
			return NextResponse.json(
				{ error: "Waste type and pickup address are required" },
				{ status: 400 }
			);
		}

		const [newRequest] = await db
			.insert(requests)
			.values({
				user_id: session?.user.id,
				waste_type,
				pickup_address,
				preferred_time: preferred_time ? new Date(preferred_time) : null,
				notes: notes || null,
				status: "pending",
			})
			.returning();

		return NextResponse.json({ request: newRequest }, { status: 201 });
	} catch (error) {
		console.error("Error creating request:", error);
		return NextResponse.json(
			{ error: "Failed to create request" },
			{ status: 500 }
		);
	}
}
