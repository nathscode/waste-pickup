import { NextResponse } from "next/server";
import { requests, user as userTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getAuthenticatedUser } from "@/action/get-authenticated-user";
import db from "@/db";

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

		const allRequests = await db
			.select({
				request: requests,
				user: userTable,
			})
			.from(requests)
			.innerJoin(userTable, eq(requests.user_id, userTable.id))
			.orderBy(desc(requests.created_at));
		const requestsWithCollector = await Promise.all(
			allRequests.map(async ({ request, user }) => {
				let collector = null;
				if (request.collector_id) {
					const [collectorData] = await db
						.select()
						.from(userTable)
						.where(eq(userTable.id, request.collector_id))
						.limit(1);
					collector = collectorData;
				}
				return {
					...request,
					user: {
						name: user.name,
						email: user.email,
						phone: user.phone,
					},
					collector: collector
						? {
								id: collector.id,
								name: collector.name,
								email: collector.email,
						  }
						: null,
				};
			})
		);

		return NextResponse.json({ requests: requestsWithCollector });
	} catch (error: any) {
		console.error("Error fetching admin requests:", error);
		return NextResponse.json(
			{ error: "Failed to fetch requests" },
			{ status: 500 }
		);
	}
}
