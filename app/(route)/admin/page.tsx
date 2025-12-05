"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { fetcher } from "@/lib/api";
import { formatDateTime, getStatusColor, getStatusLabel } from "@/lib/utils";
import {
	Loader2,
	Users,
	Clock,
	CheckCircle2,
	XCircle,
	Truck,
	ChevronRight,
	Filter,
	UserPlus,
	AlertCircle,
} from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Types
type Request = {
	id: string;
	waste_type: string;
	status: string;
	created_at: string;
	pickup_address: string;
	user: { name: string; email: string };
	collector: { id: number; name: string } | null;
};

type Stats = {
	total: number;
	pending: number;
	assigned: number;
	in_progress: number;
	completed: number;
	cancelled: number;
};

type Collector = {
	id: number;
	name: string;
	email: string;
};

export default function AdminPage() {
	const [activeTab, setActiveTab] = useState("all");

	// React Query Hooks
	const { data: requestsData, isLoading: loadingRequests } = useQuery({
		queryKey: ["admin", "requests"],
		queryFn: () => fetcher("/admin/requests"),
	});

	const { data: statsData, isLoading: loadingStats } = useQuery({
		queryKey: ["admin", "stats"],
		queryFn: () => fetcher("/admin/stats"),
	});

	// Safe Access to Data
	// API returns { requests: [...] }, so we access .requests
	const requests: Request[] = requestsData?.requests || [];
	console.log(requestsData);
	const stats: Stats | null = statsData || null;

	const filteredRequests = requests.filter((req) => {
		if (activeTab === "all") return true;
		return req.status === activeTab;
	});

	if (loadingRequests && loadingStats) {
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
					<h1 className="text-3xl font-bold tracking-tight text-slate-900">
						Admin Dashboard
					</h1>
					<p className="mt-2 text-slate-600">
						Overview of platform activity and waste pickup operations.
					</p>
				</div>

				{/* Stats Grid */}
				{stats && (
					<div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
						<StatCard
							label="Total"
							value={stats.total}
							icon={Users}
							color="bg-slate-100 text-slate-700"
						/>
						<StatCard
							label="Pending"
							value={stats.pending}
							icon={Clock}
							color="bg-yellow-100 text-yellow-700"
						/>
						<StatCard
							label="Assigned"
							value={stats.assigned}
							icon={Truck}
							color="bg-blue-100 text-blue-700"
						/>
						<StatCard
							label="InProgress"
							value={stats.in_progress}
							icon={Loader2}
							color="bg-purple-100 text-purple-700"
						/>
						<StatCard
							label="Completed"
							value={stats.completed}
							icon={CheckCircle2}
							color="bg-emerald-100 text-emerald-700"
						/>
						<StatCard
							label="Cancelled"
							value={stats.cancelled}
							icon={XCircle}
							color="bg-red-100 text-red-700"
						/>
					</div>
				)}

				{/* Filter Tabs using Shadcn UI */}
				<div className="space-y-4">
					<div className="flex items-center gap-2 text-sm font-medium text-slate-500">
						<Filter className="h-4 w-4" /> Filter Requests:
					</div>

					<Tabs
						defaultValue="all"
						value={activeTab}
						onValueChange={setActiveTab}
						className="w-full"
					>
						<TabsList className="w-full justify-start overflow-x-auto bg-white p-1 shadow-sm sm:w-auto">
							{[
								"all",
								"pending",
								"assigned",
								"in_progress",
								"completed",
								"cancelled",
							].map((status) => (
								<TabsTrigger
									key={status}
									value={status}
									className="px-4 capitalize data-[state=active]:bg-slate-900 data-[state=active]:text-white"
								>
									{status === "all" ? "All Requests" : getStatusLabel(status)}
								</TabsTrigger>
							))}
						</TabsList>

						<TabsContent value={activeTab} className="mt-6">
							<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
								{filteredRequests.length === 0 ? (
									<div className="flex flex-col items-center justify-center py-20 text-center">
										<div className="mb-4 rounded-full bg-slate-50 p-4">
											<AlertCircle className="h-8 w-8 text-slate-400" />
										</div>
										<h3 className="text-lg font-medium text-slate-900">
											No requests found
										</h3>
										<p className="text-slate-500">
											There are no requests with this status.
										</p>
									</div>
								) : (
									<div className="divide-y divide-slate-100">
										{filteredRequests.map((request) => (
											<div
												key={request.id}
												className="group flex flex-col gap-4 p-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
											>
												{/* Main Content */}
												<Link
													href={`/admin/request/${request.id}`}
													className="flex-1"
												>
													<div className="flex items-center gap-4">
														<div>
															<div className="flex items-center gap-2">
																<h4 className="font-semibold text-slate-900">
																	{request.waste_type}
																</h4>
																<span
																	className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getStatusColor(
																		request.status
																	)}`}
																>
																	{getStatusLabel(request.status)}
																</span>
															</div>
															<p className="text-sm text-slate-500 line-clamp-1">
																{formatDateTime(request.created_at)} •{" "}
																{request.user?.name}
															</p>
														</div>
													</div>
												</Link>

												{/* Meta Info & Actions */}
												<div className="flex items-center justify-between gap-6 sm:justify-end">
													<div className="hidden text-right sm:block">
														<p className="text-xs font-medium uppercase text-slate-400">
															Collector
														</p>
														{request.collector ? (
															<p className="text-sm font-medium text-blue-600">
																{request.collector.name}
															</p>
														) : (
															<p className="text-sm text-slate-400">
																Unassigned
															</p>
														)}
													</div>

													<div className="flex items-center gap-2">
														{/* Assign Dialog Trigger */}
														{request.status === "pending" && (
															<AssignCollectorDialog request={request} />
														)}

														<Link href={`/admin/request/${request.id}`}>
															<Button variant="ghost" size="icon">
																<ChevronRight className="h-5 w-5 text-slate-400" />
															</Button>
														</Link>
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}

// --- SUB-COMPONENTS ---

// 1. Stats Card
function StatCard({ label, value, icon: Icon, color }: any) {
	return (
		<div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
			<div
				className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}
			>
				<Icon className="h-5 w-5" />
			</div>
			<div>
				<p className="text-xs font-medium uppercase text-slate-500">{label}</p>
				<p className="text-xl font-bold text-slate-900">{value}</p>
			</div>
		</div>
	);
}

// 2. Assign Collector Dialog Component
function AssignCollectorDialog({ request }: { request: Request }) {
	const [open, setOpen] = useState(false);
	const [selectedCollector, setSelectedCollector] = useState("");
	const queryClient = useQueryClient();

	const { data: collectorsData } = useQuery({
		queryKey: ["admin", "collectors"],
		queryFn: () => fetcher("/admin/collectors"),
		enabled: open, // Only fetch when dialog opens
	});

	const collectors: Collector[] = collectorsData?.collectors || [];

	const assignMutation = useMutation({
		mutationFn: (data: { request_id: string; collector_id: string }) =>
			api.post("/admin/assign", data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "requests"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
			setOpen(false);
			// You could add a toast notification here
		},
	});

	const handleAssign = () => {
		if (!selectedCollector) return;
		assignMutation.mutate({
			request_id: request.id,
			collector_id: selectedCollector,
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
					onClick={(e) => e.stopPropagation()} // Prevent triggering the row Link
				>
					<UserPlus className="h-4 w-4" />
					Assign
				</Button>
			</DialogTrigger>
			<DialogContent
				className="sm:max-w-[425px]"
				onClick={(e) => e.stopPropagation()}
			>
				<DialogHeader>
					<DialogTitle>Assign Collector</DialogTitle>
					<DialogDescription>
						Assign a collector to pickup request <strong>#{request.id}</strong>.
						<br />
						<span className="text-xs text-slate-500">
							Location: {request.pickup_address}
						</span>
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="collector">Select Collector</Label>
						<Select
							onValueChange={setSelectedCollector}
							value={selectedCollector}
						>
							<SelectTrigger>
								<SelectValue placeholder="Choose a collector..." />
							</SelectTrigger>
							<SelectContent>
								{collectors.length === 0 ? (
									<div className="p-2 text-sm text-slate-500">
										No collectors available
									</div>
								) : (
									collectors.map((c) => (
										<SelectItem key={c.id} value={c.id.toString()}>
											{c.name} ({c.email})
										</SelectItem>
									))
								)}
							</SelectContent>
						</Select>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button
						onClick={handleAssign}
						disabled={!selectedCollector || assignMutation.isPending}
						className="bg-emerald-600 hover:bg-emerald-700 text-white"
					>
						{assignMutation.isPending && (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						)}
						Confirm Assignment
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
