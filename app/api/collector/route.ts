import { getAuthenticatedUser } from "@/action/get-authenticated-user";
import db from "@/db";
import { requests, user as userTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const session = await getAuthenticatedUser();

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (session?.user.role !== "COLLECTOR") {
			return NextResponse.json(
				{ error: "Unauthorized to carry this action" },
				{ status: 401 }
			);
		}

		const collectorRequests = await db
			.select({
				request: requests,
				user: userTable, // The customer details
			})
			.from(requests)
			.innerJoin(userTable, eq(requests.user_id, userTable.id))
			.where(eq(requests.collector_id, session?.user.id))
			.orderBy(desc(requests.created_at));

		const formattedRequests = collectorRequests.map(({ request, user }) => ({
			...request,
			user: {
				name: user.name,
				email: user.email,
				phone: user.phone,
			},
		}));

		return NextResponse.json({ requests: formattedRequests });
	} catch (error: any) {
		console.error("Error fetching collector requests:", error);

		return NextResponse.json(
			{ error: "Failed to fetch requests" },
			{ status: 500 }
		);
	}
}
