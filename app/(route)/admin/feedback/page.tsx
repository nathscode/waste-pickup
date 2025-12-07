"use client";

import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import { Loader2, Star, MessageSquare } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";

export default function AdminFeedbackPage() {
	const { data, isLoading } = useQuery({
		queryKey: ["admin", "feedback"],
		queryFn: () => fetcher("/feedback"), // Matches GET in step 1
	});

	const feedbacks = data?.feedbacks || [];

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-slate-900">User Feedback</h1>
					<p className="mt-1 text-slate-600">
						Reviews submitted by customers upon completion.
					</p>
				</div>

				<div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
					<Table>
						<TableHeader className="bg-slate-50">
							<TableRow>
								<TableHead>Request ID</TableHead>
								<TableHead>Rating</TableHead>
								<TableHead>Comment</TableHead>
								<TableHead className="text-right">Date</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{feedbacks.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={4}
										className="h-24 text-center text-slate-500"
									>
										No feedback received yet.
									</TableCell>
								</TableRow>
							) : (
								feedbacks.map(({ feedback, request }: any) => (
									<TableRow key={feedback.id}>
										<TableCell>
											<Link
												href={`/admin/request/${feedback.request_id}`}
												className="font-medium text-emerald-600 hover:underline"
											>
												#{feedback.request_id}
											</Link>
											<div className="text-xs text-slate-500">
												{request?.waste_type}
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-1">
												<span className="font-bold text-slate-900">
													{feedback.rating}
												</span>
												<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
											</div>
										</TableCell>
										<TableCell>
											{feedback.comment ? (
												<span className="text-slate-700">
													{feedback.comment}
												</span>
											) : (
												<span className="text-slate-400 italic text-sm">
													No comment
												</span>
											)}
										</TableCell>
										<TableCell className="text-right text-slate-500">
											{formatDateTime(feedback.created_at)}
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
