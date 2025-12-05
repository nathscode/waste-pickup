import { NextResponse } from "next/server";
import { requests, user } from "@/db/schema";
import { eq, aliasedTable } from "drizzle-orm";
import { getAuthenticatedUser } from "@/action/get-authenticated-user";
import db from "@/db";

type Params = {
	params: Promise<{
		id: string;
	}>;
};

export async function GET(req: Request, { params }: Params) {
	try {
		const session = await getAuthenticatedUser();

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;
		const requestId = String(id);

		if (!requestId) {
			return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
		}

		const customerTable = aliasedTable(user, "user");
		const collectorTable = aliasedTable(user, "collector");

		// 3. Perform the Query
		const [result] = await db
			.select({
				request: requests,
				user: customerTable,
				collector: collectorTable,
			})
			.from(requests)
			.leftJoin(customerTable, eq(requests.user_id, customerTable.id))
			.leftJoin(collectorTable, eq(requests.collector_id, collectorTable.id))
			.where(eq(requests.id, requestId))
			.limit(1);

		if (!result) {
			return NextResponse.json({ error: "Request not found" }, { status: 404 });
		}
		const isOwner = result.request.user_id === session.user.id;
		const isAdmin = session.user.role === "ADMIN";
		const isCollector = session.user.role === "COLLECTOR";

		if (!isOwner && !isAdmin && !isCollector) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		// 5. Return sanitized data
		return NextResponse.json({
			request: {
				...result.request,
				user: result.user
					? {
							name: result.user.name,
							email: result.user.email,
							phone: result.user.phone,
					  }
					: null,
				collector: result.collector
					? {
							id: result.collector.id,
							name: result.collector.name,
							email: result.collector.email,
					  }
					: null,
			},
		});
	} catch (error: any) {
		console.error("Error fetching request:", error);
		return NextResponse.json(
			{ error: "Failed to fetch request" },
			{ status: 500 }
		);
	}
}
// PATCH - Update request (for collectors and admins)
export async function PATCH(request: Request, { params }: Params) {
	try {
		const session = await getAuthenticatedUser();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;
		const body = await request.json();

		const [existingRequest] = await db
			.select()
			.from(requests)
			.where(eq(requests.id, id))
			.limit(1);

		if (!existingRequest) {
			return NextResponse.json({ error: "Request not found" }, { status: 404 });
		}

		// Check permissions
		const isCollectorForThisRequest =
			session?.user.role === "COLLECTOR" &&
			existingRequest.collector_id === session?.user.id;
		const isAdmin = session?.user.role === "ADMIN";

		if (!isCollectorForThisRequest && !isAdmin) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		// Build update object
		const updateData: any = {
			updated_at: new Date(),
		};

		if (body.status) {
			updateData.status = body.status;
		}

		if (body.collector_id && isAdmin) {
			updateData.collector_id = body.collector_id;
		}

		// Update request
		const [updatedRequest] = await db
			.update(requests)
			.set(updateData)
			.where(eq(requests.id, id))
			.returning();

		return NextResponse.json({ request: updatedRequest });
	} catch (error) {
		console.error("Error updating request:", error);
		return NextResponse.json(
			{ error: "Failed to update request" },
			{ status: 500 }
		);
	}
}
