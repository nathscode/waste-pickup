import Link from "next/link";
import { Request, User } from "@/db/schema";
import { formatDateTime, getStatusColor, getStatusLabel } from "@/lib/utils";
import {
	MapPin,
	Calendar,
	Clock,
	User as UserIcon,
	MessageSquare,
} from "lucide-react";

type RequestCardProps = {
	request: Request & {
		user?: User;
		collector?: User;
	};
	showUser?: boolean;
	showCollector?: boolean;
};

export default function RequestCard({
	request,
	showUser,
	showCollector,
}: RequestCardProps) {
	return (
		<Link href={`/request/${request.id}`} className="block h-full">
			<div className="group flex h-full flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md">
				{/* Header */}
				<div>
					<div className="mb-4 flex items-start justify-between">
						<div>
							<span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
								Type
							</span>
							<h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
								{request.waste_type}
							</h3>
						</div>
						<span
							className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ${getStatusColor(
								request.status
							)}`}
						>
							{getStatusLabel(request.status)}
						</span>
					</div>

					{/* Details List */}
					<div className="space-y-3">
						<div className="flex items-start gap-3 text-slate-600">
							<MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
							<p className="text-sm line-clamp-2">{request.pickup_address}</p>
						</div>

						{request.preferred_time && (
							<div className="flex items-center gap-3 text-slate-600">
								<Clock className="h-4 w-4 shrink-0 text-slate-400" />
								<p className="text-sm">
									{formatDateTime(request.preferred_time)}
								</p>
							</div>
						)}

						{showUser && request.user && (
							<div className="flex items-center gap-3 text-slate-600">
								<UserIcon className="h-4 w-4 shrink-0 text-slate-400" />
								<p className="text-sm">
									By:{" "}
									<span className="font-medium text-slate-900">
										{request.user.name}
									</span>
								</p>
							</div>
						)}

						{showCollector && request.collector && (
							<div className="flex items-center gap-3 text-slate-600">
								<UserIcon className="h-4 w-4 shrink-0 text-slate-400" />
								<p className="text-sm">
									Collector:{" "}
									<span className="font-medium text-slate-900">
										{request.collector.name}
									</span>
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Footer Meta */}
				<div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4 text-xs text-slate-400">
					<div className="flex items-center gap-1">
						<Calendar className="h-3 w-3" />
						{formatDateTime(request.created_at)}
					</div>
					{request.notes && (
						<div className="flex items-center gap-1 text-emerald-600 font-medium">
							<MessageSquare className="h-3 w-3" />
							Has notes
						</div>
					)}
				</div>
			</div>
		</Link>
	);
}
