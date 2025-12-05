"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDateTime, getStatusColor, getStatusLabel } from "@/lib/utils";
import {
	MapPin,
	Clock,
	Calendar,
	CheckCircle2,
	Play,
	User,
	Phone,
} from "lucide-react";
import { toast } from "sonner";

type Request = any;

export default function CollectorPage() {
	const [requests, setRequests] = useState<Request[]>([]);
	const [loading, setLoading] = useState(true);
	const [updating, setUpdating] = useState<number | null>(null);

	useEffect(() => {
		fetchRequests();
	}, []);

	const fetchRequests = async () => {
		try {
			const res = await fetch("/api/collector");
			if (res.ok) {
				const data = await res.json();
				setRequests(data.requests || []);
			}
		} catch (error) {
			console.error("Error fetching requests:", error);
		} finally {
			setLoading(false);
		}
	};

	const updateStatus = async (requestId: number, newStatus: string) => {
		setUpdating(requestId);
		try {
			const res = await fetch(`/api/requests/${requestId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: newStatus }),
			});

			if (res.ok) {
				await fetchRequests();
				toast.success(`You successfully update to ${newStatus}`);
			}
		} catch (error) {
			console.error("Error updating status:", error);
			toast.error(`Error updating status ${error}`);
		} finally {
			setUpdating(null);
		}
	};

	if (loading) {
		return (
			<div className="flex h-64 w-full items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight text-slate-900">
						Collector Dashboard
					</h1>
					<p className="mt-1 text-slate-600">
						Overview of your assigned pickups
					</p>
				</div>

				{requests.length === 0 ? (
					<div className="rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center">
						<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
							<CheckCircle2 className="h-6 w-6 text-slate-400" />
						</div>
						<h3 className="text-lg font-medium text-slate-900">
							All caught up!
						</h3>
						<p className="text-slate-500">
							No pending pickup requests assigned to you.
						</p>
					</div>
				) : (
					<div className="grid gap-6 lg:grid-cols-2">
						{requests.map((request: any) => (
							<div
								key={request.id}
								className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
							>
								{/* Header */}
								<div className="flex items-start justify-between mb-6">
									<div>
										<div className="mb-1 flex items-center gap-2">
											<span className="text-xs font-semibold uppercase text-slate-400">
												#{request.id}
											</span>
											<span className="h-1 w-1 rounded-full bg-slate-300"></span>
											<span className="text-xs font-semibold uppercase text-slate-400">
												{formatDateTime(request.created_at)}
											</span>
										</div>

										<Link href={`/request/${request.id}`} className="group">
											<h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
												{request.waste_type}
											</h3>
										</Link>
									</div>
									<span
										className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusColor(
											request.status
										)}`}
									>
										{getStatusLabel(request.status)}
									</span>
								</div>

								{/* Content Grid */}
								<div className="mb-6 grid gap-4 rounded-xl bg-slate-50 p-4">
									<div className="flex gap-3">
										<MapPin className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
										<div>
											<span className="block text-xs font-medium uppercase text-slate-400">
												Location
											</span>
											<p className="text-sm font-medium text-slate-900">
												{request.pickup_address}
											</p>
										</div>
									</div>

									{request.preferred_time && (
										<div className="flex gap-3">
											<Clock className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
											<div>
												<span className="block text-xs font-medium uppercase text-slate-400">
													Time
												</span>
												<p className="text-sm font-medium text-slate-900">
													{formatDateTime(request.preferred_time)}
												</p>
											</div>
										</div>
									)}

									{request.user && (
										<div className="flex gap-3">
											<User className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
											<div>
												<span className="block text-xs font-medium uppercase text-slate-400">
													Customer
												</span>
												<p className="text-sm font-medium text-slate-900">
													{request.user.name}
												</p>
												{request.user.phone && (
													<div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
														<Phone className="h-3 w-3" /> {request.user.phone}
													</div>
												)}
											</div>
										</div>
									)}
								</div>

								{/* Actions */}
								<div className="flex gap-3">
									{request.status === "assigned" && (
										<button
											onClick={() => updateStatus(request.id, "in_progress")}
											disabled={updating === request.id}
											className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
										>
											{updating === request.id ? (
												"Starting..."
											) : (
												<>
													<Play className="h-4 w-4" /> Start Job
												</>
											)}
										</button>
									)}

									{request.status === "in_progress" && (
										<button
											onClick={() => updateStatus(request.id, "completed")}
											disabled={updating === request.id}
											className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
										>
											{updating === request.id ? (
												"Completing..."
											) : (
												<>
													<CheckCircle2 className="h-4 w-4" /> Mark Complete
												</>
											)}
										</button>
									)}

									<Link
										href={`/request/${request.id}`}
										className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
									>
										Details
									</Link>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
