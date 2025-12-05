"use client";

import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import { Loader2, Mail, Phone, Calendar, User as UserIcon } from "lucide-react";

type Collector = {
	id: number;
	name: string;
	email: string;
	phone: string | null;
	created_at: string;
};

export default function AdminCollectorsPage() {
	const { data, isLoading } = useQuery({
		queryKey: ["admin", "collectors"],
		queryFn: () => fetcher("/admin/collectors"),
	});

	const collectors: Collector[] = data?.collectors || [];

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
					<h1 className="text-3xl font-bold tracking-tight text-slate-900">
						Collectors
					</h1>
					<p className="mt-2 text-slate-600">
						Manage your fleet of waste collectors.
					</p>
				</div>

				{collectors.length === 0 ? (
					<div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
						No collectors found.
					</div>
				) : (
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{collectors.map((collector) => (
							<div
								key={collector.id}
								className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
							>
								{/* Decorative Background */}
								<div className="absolute left-0 top-0 h-24 w-full bg-linear-to-br from-slate-100 to-slate-200 transition-opacity group-hover:opacity-80"></div>

								<div className="relative mb-4 flex justify-center">
									<div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white shadow-sm">
										<div className="flex h-full w-full items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700">
											{collector.name.charAt(0)}
										</div>
									</div>
								</div>

								<div className="mb-6 text-center">
									<h3 className="text-lg font-bold text-slate-900">
										{collector.name}
									</h3>
									<span className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-600">
										ID: {collector.id}
									</span>
								</div>

								<div className="space-y-3 text-sm">
									<div className="flex items-center gap-3 rounded-lg bg-slate-50 p-2 text-slate-600">
										<Mail className="h-4 w-4 text-slate-400" />
										<span className="truncate">{collector.email}</span>
									</div>

									{collector.phone && (
										<div className="flex items-center gap-3 rounded-lg bg-slate-50 p-2 text-slate-600">
											<Phone className="h-4 w-4 text-slate-400" />
											<span>{collector.phone}</span>
										</div>
									)}

									<div className="flex items-center gap-3 px-2 text-xs text-slate-400">
										<Calendar className="h-3 w-3" />
										Joined {new Date(collector.created_at).toLocaleDateString()}
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
