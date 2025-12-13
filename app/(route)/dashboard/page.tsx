import Link from "next/link";
import { redirect } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { getAuthenticatedUser } from "@/action/get-authenticated-user";
import { requests, user } from "@/db/schema";
import db from "@/db";
import RequestCard from "@/components/cards/request-card";
import { Plus, Inbox } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
	const session = await getAuthenticatedUser();

	if (!session) {
		return redirect("/login");
	}

	const userRequests = await db
		.select({
			request: requests,
			collector: user,
		})
		.from(requests)
		// Fix: Join on collector ID table match, not session ID match
		.leftJoin(user, eq(requests.collector_id, user.id))
		.where(eq(requests.user_id, session.user.id))
		.orderBy(desc(requests.created_at));

	const formattedRequests = userRequests.map(({ request, collector }) => ({
		...request,
		collector,
	}));

	return (
		<div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				{/* Header */}
				<div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-slate-900">
							My Requests
						</h1>
						<p className="mt-1 text-slate-600">
							Manage your pickups and view history
						</p>
					</div>
					<Link
						href="/request/new"
						className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
					>
						<Plus className="h-5 w-5" />
						New Request
					</Link>
				</div>

				{/* Content */}
				{formattedRequests.length === 0 ? (
					<div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">
						<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
							<Inbox className="h-8 w-8 text-slate-400" />
						</div>
						<h3 className="mb-2 text-lg font-semibold text-slate-900">
							No requests found
						</h3>
						<p className="mb-8 max-w-sm text-slate-500">
							You haven&apos;t made any pickup requests yet. Help us keep the
							environment clean by making your first request.
						</p>
						<Link
							href="/request/new"
							className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
						>
							Create your first request &rarr;
						</Link>
					</div>
				) : (
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{formattedRequests.map((request) => (
							<RequestCard
								key={request.id}
								// @ts-ignore
								request={request}
								showCollector={true}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
