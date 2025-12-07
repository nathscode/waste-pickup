"use client";

import { FeedbackDialog } from "@/components/feedback-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/api";
import { formatDateTime, getStatusColor, getStatusLabel } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
	AlertTriangle,
	ArrowLeft,
	Bubbles,
	Clock,
	FileText,
	Loader2,
	Mail,
	MapPin,
	Phone,
	Star,
	User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";

type Props = {
	params: Promise<{ id: string }>;
};

// Define the shape of the data returned from the API
type RequestData = {
	id: number;
	waste_type: string;
	status: string;
	created_at: string;
	updated_at: string;
	pickup_address: string;
	preferred_time: string | null;
	notes: string | null;
	user: {
		name: string;
		email: string;
		phone: string | null;
	};
	collector: {
		id: string;
		name: string;
		email: string;
	} | null;
	feedback: {
		id: string;
		rating: number;
		comment: string;
	} | null;
};

export default function RequestDetailPage({ params }: Props) {
	// Unwrap params using React's use() hook (Next.js 15+)
	const { id } = use(params);
	const router = useRouter();

	// 1. Fetch Data with React Query
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["request", id],
		queryFn: () => fetcher(`/requests/${id}`),
		retry: 1, // Don't retry indefinitely if 403/404
	});

	// 2. Loading State
	if (isLoading) {
		return (
			<div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-slate-50">
				<Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
				<p className="text-slate-500 font-medium">Loading request details...</p>
			</div>
		);
	}

	// 3. Error Handling (403 Forbidden, 404 Not Found, etc.)
	if (isError) {
		const errorMessage = error?.message || "Failed to load request";

		return (
			<div className="flex h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
				<div className="mb-4 rounded-full bg-red-100 p-4">
					<AlertTriangle className="h-8 w-8 text-red-600" />
				</div>
				<h2 className="text-2xl font-bold text-slate-900">
					Unable to View Request
				</h2>
				<p className="mt-2 text-slate-600 max-w-md">
					{errorMessage === "Forbidden"
						? "You do not have permission to access this request details."
						: errorMessage}
				</p>
				<Button
					variant="outline"
					className="mt-6"
					onClick={() => router.back()}
				>
					Go Back
				</Button>
			</div>
		);
	}

	const request: RequestData = data?.request;
	const requestUser = request.user;
	const collector = request.collector;
	const feedback = request.feedback;
	const showRating = request.status === "completed" && !feedback?.id;

	return (
		<div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl">
				<div className="mb-6">
					<button
						onClick={() => router.back()}
						className="group inline-flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-emerald-600"
					>
						<ArrowLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
						Back
					</button>
				</div>

				{/* Main Content Grid */}
				<div className="grid gap-6 md:grid-cols-3">
					{/* LEFT COLUMN: Main Details */}
					<div className="md:col-span-2 space-y-6">
						{/* Header Card */}
						<div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
							<div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
								<div>
									<h1 className="text-3xl font-bold text-slate-900">
										{request.waste_type}
									</h1>
									<p className="text-slate-500">Request #{request.id}</p>
								</div>
								<span
									className={`self-start rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-wide ${getStatusColor(
										request.status
									)}`}
								>
									{getStatusLabel(request.status)}
								</span>
							</div>

							<div className="mt-8 grid gap-6">
								<div className="flex gap-4">
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
										<MapPin className="h-5 w-5" />
									</div>
									<div>
										<h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
											Pickup Location
										</h3>
										<p className="mt-1 text-lg font-medium text-slate-900">
											{request.pickup_address}
										</p>
									</div>
								</div>

								{request.preferred_time && (
									<div className="flex gap-4">
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
											<Clock className="h-5 w-5" />
										</div>
										<div>
											<h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
												Preferred Time
											</h3>
											<p className="mt-1 text-lg font-medium text-slate-900">
												{formatDateTime(request.preferred_time)}
											</p>
										</div>
									</div>
								)}
							</div>
							{showRating && (
								<div className="mt-8 border-t border-slate-100 pt-6">
									<div className="rounded-xl bg-emerald-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
										<div>
											<h3 className="font-bold text-emerald-900">
												Job Completed
											</h3>
											<p className="text-sm text-emerald-700">
												The collector has marked this request as done.
											</p>
										</div>
										<div className="w-full sm:w-auto">
											<FeedbackDialog requestId={request.id} />
										</div>
									</div>
								</div>
							)}
						</div>

						{/* Notes Card */}
						{request.notes && (
							<div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
								<div className="mb-4 flex items-center gap-3">
									<FileText className="h-5 w-5 text-slate-400" />
									<h3 className="text-lg font-bold text-slate-900">
										Additional Notes
									</h3>
								</div>
								<div className="rounded-xl bg-slate-50 p-4 text-slate-700 italic border border-slate-100">
									"{request.notes}"
								</div>
							</div>
						)}
						{feedback?.id && (
							<div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
								<div className="mb-4 flex items-center gap-3">
									<Mail className="h-5 w-5 text-slate-400" />
									<h3 className="text-lg font-bold text-slate-900">Feedback</h3>
								</div>
								<div className="rounded-xl bg-slate-50 p-4 text-slate-700  border border-slate-100">
									<div className="flex flex-col gap-2">
										<span className="inline-flex justify-center items-center w-fit bg-orange-500! text-orange-100! px-2 rounded-sm gap-1 font-semibold">
											<Star className="size-4 fill-orange-100" />
											{feedback.rating}
										</span>
										<span>{feedback.comment}</span>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* RIGHT COLUMN: People & Meta */}
					<div className="space-y-6">
						{/* Customer Info */}
						<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
							<h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-400">
								Requested By
							</h3>
							<div className="mb-3 flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
									{requestUser.name.charAt(0)}
								</div>
								<div>
									<p className="font-bold text-slate-900 line-clamp-1">
										{requestUser.name}
									</p>
									<p className="text-xs text-slate-500">Customer</p>
								</div>
							</div>
							<div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
								<div className="flex items-center gap-2 text-sm text-slate-600">
									<Mail className="h-4 w-4 text-slate-400" />
									<span className="truncate">{requestUser.email}</span>
								</div>
								{requestUser.phone && (
									<div className="flex items-center gap-2 text-sm text-slate-600">
										<Phone className="h-4 w-4 text-slate-400" />
										<span>{requestUser.phone}</span>
									</div>
								)}
							</div>
						</div>

						{/* Collector Info */}
						{collector ? (
							<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
								<h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-400">
									Assigned Collector
								</h3>
								<div className="mb-3 flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
										{collector.name.charAt(0)}
									</div>
									<div>
										<p className="font-bold text-slate-900 line-clamp-1">
											{collector.name}
										</p>
										<p className="text-xs text-slate-500">Professional</p>
									</div>
								</div>
								<div className="mt-4 border-t border-slate-100 pt-4">
									<div className="flex items-center gap-2 text-sm text-slate-600">
										<Mail className="h-4 w-4 text-slate-400" />
										<span className="truncate">{collector.email}</span>
									</div>
								</div>
							</div>
						) : (
							<div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
								<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
									<User className="h-6 w-6 text-slate-400" />
								</div>
								<p className="text-sm font-medium text-slate-600">
									No collector assigned yet
								</p>
							</div>
						)}

						{/* Timestamps */}
						<div className="rounded-2xl bg-slate-100 p-4 text-xs text-slate-500 space-y-2">
							<div className="flex justify-between">
								<span>Created</span>
								<span className="font-medium text-slate-700">
									{formatDateTime(request.created_at)}
								</span>
							</div>
							<div className="flex justify-between">
								<span>Last Update</span>
								<span className="font-medium text-slate-700">
									{formatDateTime(request.updated_at)}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
