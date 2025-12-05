import { NextResponse } from "next/server";
import { requests } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
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
		const stats = await db
			.select({
				status: requests.status,
				count: sql<number>`cast(count(*) as integer)`,
			})
			.from(requests)
			.groupBy(requests.status);

		// Format stats
		const formattedStats = {
			total: 0,
			pending: 0,
			assigned: 0,
			in_progress: 0,
			completed: 0,
			cancelled: 0,
		};

		stats.forEach((stat) => {
			formattedStats.total += stat.count;
			formattedStats[stat.status as keyof typeof formattedStats] = stat.count;
		});

		return NextResponse.json(formattedStats);
	} catch (error: any) {
		console.error("Error fetching stats:", error);

		if (error.message === "Unauthorized" || error.message === "Forbidden") {
			return NextResponse.json(
				{ error: error.message },
				{ status: error.message === "Unauthorized" ? 401 : 403 }
			);
		}

		return NextResponse.json(
			{ error: "Failed to fetch statistics" },
			{ status: 500 }
		);
	}
}
