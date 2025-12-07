"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { fetcher } from "@/lib/api";
import { formatDateTime, getStatusColor, getStatusLabel } from "@/lib/utils";
import {
	ArrowLeft,
	MapPin,
	Clock,
	User,
	ShieldCheck,
	Loader2,
	Mail,
	Star,
} from "lucide-react";
import { toast } from "sonner";

type Props = {
	params: Promise<{ id: string }>;
};

export default function AdminRequestDetailPage({ params }: Props) {
	const { id } = use(params);
	const router = useRouter();
	const queryClient = useQueryClient();
	const [selectedCollector, setSelectedCollector] = useState("");

	// 1. Parallel Queries
	const { data: requestData, isLoading: reqLoading } = useQuery({
		queryKey: ["request", id],
		queryFn: () => fetcher(`/requests/${id}`),
	});

	const { data: collectorsData, isLoading: colLoading } = useQuery({
		queryKey: ["admin", "collectors"],
		queryFn: () => fetcher("/admin/collectors"),
	});

	// 2. Mutation for assignment
	const assignMutation = useMutation({
		mutationFn: (data: { request_id: string; collector_id: string }) =>
			api.post("/admin/assign", data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["request", id] });
			toast.success("Assigned successfully");
			router.push("/admin");
		},
	});

	const handleAssign = () => {
		if (!selectedCollector) return;
		assignMutation.mutate({
			request_id: String(id),
			collector_id: String(selectedCollector),
		});
	};

	if (reqLoading || colLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
			</div>
		);
	}

	const request = requestData?.request;
	const collectors = collectorsData?.collectors || [];

	if (!request) {
		return (
			<div className="p-8 text-center text-red-500">Request not found</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-5xl">
				<div className="mb-6">
					<Link
						href="/admin"
						className="group inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900"
					>
						<ArrowLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
						Back to Dashboard
					</Link>
				</div>

				<div className="grid gap-6 lg:grid-cols-3">
					{/* Main Detail Column */}
					<div className="lg:col-span-2 space-y-6">
						{/* Header Card */}
						<div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
							<div className="flex items-start justify-between">
								<div>
									<div className="flex items-center gap-3">
										<h1 className="text-2xl font-bold text-slate-900">
											Request #{request.id}
										</h1>
										<span
											className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusColor(
												request.status
											)}`}
										>
											{getStatusLabel(request.status)}
										</span>
									</div>
									<p className="mt-1 text-slate-500">
										Created on {formatDateTime(request.created_at)}
									</p>
								</div>
							</div>

							<div className="mt-8 space-y-6">
								<div>
									<h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
										Waste Type
									</h3>
									<p className="mt-1 text-xl font-medium text-slate-900">
										{request.waste_type}
									</p>
								</div>

								<div className="flex items-start gap-3">
									<MapPin className="mt-1 h-5 w-5 text-slate-400" />
									<div>
										<h3 className="text-sm font-semibold text-slate-500">
											Pickup Address
										</h3>
										<p className="text-lg text-slate-900">
											{request.pickup_address}
										</p>
									</div>
								</div>

								{request.preferred_time && (
									<div className="flex items-start gap-3">
										<Clock className="mt-1 h-5 w-5 text-slate-400" />
										<div>
											<h3 className="text-sm font-semibold text-slate-500">
												Preferred Time
											</h3>
											<p className="text-lg text-slate-900">
												{formatDateTime(request.preferred_time)}
											</p>
										</div>
									</div>
								)}

								{request.notes && (
									<div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
										<p className="text-sm font-bold text-slate-500 mb-1">
											Customer Notes:
										</p>
										<p className="text-slate-700 italic">"{request.notes}"</p>
									</div>
								)}
								{request.feedback?.id && (
									<div className="flex flex-col w-full">
										<div className="mb-4 flex items-center gap-3">
											<Mail className="h-5 w-5 text-slate-400" />
											<h3 className="text-lg font-bold text-slate-900">
												Feedback
											</h3>
										</div>
										<div className="rounded-xl bg-slate-50 p-4 text-slate-700  border border-slate-100">
											<div className="flex flex-col gap-2">
												<span className="inline-flex justify-center items-center w-fit bg-orange-500! text-orange-100! px-2 rounded-sm gap-1 font-semibold">
													<Star className="size-4 fill-orange-100" />
													{request.feedback.rating}
												</span>
												<span>{request.feedback.comment}</span>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Sidebar Column */}
					<div className="space-y-6">
						{/* Assignment Box */}
						<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
							<h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
								<ShieldCheck className="h-5 w-5 text-emerald-600" />
								Assignment
							</h2>

							{request.status === "pending" ? (
								<div className="space-y-4">
									<div>
										<label className="mb-1.5 block text-sm font-medium text-slate-700">
											Select Collector
										</label>
										<select
											value={selectedCollector}
											onChange={(e) => setSelectedCollector(e.target.value)}
											className="block w-full rounded-xl border-slate-200 bg-slate-50 py-3 text-sm focus:border-emerald-500 focus:ring-emerald-500"
										>
											<option value="">Choose a collector...</option>
											{collectors.map((c: any) => (
												<option key={c.id} value={c.id}>
													{c.name} ({c.email})
												</option>
											))}
										</select>
									</div>

									<button
										onClick={handleAssign}
										disabled={!selectedCollector || assignMutation.isPending}
										className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-50"
									>
										{assignMutation.isPending && (
											<Loader2 className="h-4 w-4 animate-spin" />
										)}
										{assignMutation.isPending
											? "Assigning..."
											: "Assign Collector"}
									</button>
								</div>
							) : (
								<div className="rounded-xl bg-blue-50 p-4 text-center">
									<div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
										<User className="h-5 w-5" />
									</div>
									<p className="text-xs font-bold uppercase text-blue-600">
										Assigned To
									</p>
									<p className="font-bold text-slate-900">
										{request.collector?.name || "Unknown"}
									</p>
									<p className="text-xs text-slate-500">
										{request.collector?.email}
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
