"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { fetcher } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import {
	Loader2,
	MoreHorizontal,
	Shield,
	ShieldAlert,
	ShieldCheck,
	User,
	Search,
} from "lucide-react";

// Shadcn UI Imports
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
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
type UserData = {
	id: number;
	name: string;
	email: string;
	role: "ADMIN" | "COLLECTOR" | "USER";
	image: string | null;
	created_at: string;
};

export default function AdminUsersPage() {
	const [searchTerm, setSearchTerm] = useState("");

	// Fetch Users
	const { data, isLoading, isError } = useQuery({
		queryKey: ["admin", "users"],
		queryFn: () => fetcher("/admin/users"),
	});

	const users: UserData[] = data?.users || [];

	// Filter Logic
	const filteredUsers = users.filter(
		(user) =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex h-screen items-center justify-center text-red-500">
				Unauthorized or Failed to load users.
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				{/* Header */}
				<div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-slate-900">
							User Management
						</h1>
						<p className="mt-1 text-slate-600">
							View all registered users and manage their access roles.
						</p>
					</div>

					{/* Search Bar */}
					<div className="relative w-full sm:w-72">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<Input
							placeholder="Search by name or email..."
							className="pl-9 bg-white"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>

				{/* Users Table */}
				<div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
					<Table>
						<TableHeader className="bg-slate-50">
							<TableRow>
								<TableHead className="w-20">User</TableHead>
								<TableHead>Name & Email</TableHead>
								<TableHead>Current Role</TableHead>
								<TableHead className="hidden md:table-cell">Joined</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredUsers.length === 0 ? (
								<TableRow>
									<TableCell colSpan={5} className="h-24 text-center">
										No users found.
									</TableCell>
								</TableRow>
							) : (
								filteredUsers.map((user) => (
									<TableRow key={user.id}>
										<TableCell>
											<Avatar className="h-9 w-9">
												<AvatarImage src={user.image || ""} />
												<AvatarFallback className="bg-emerald-100 text-emerald-700">
													{user.name.charAt(0)}
												</AvatarFallback>
											</Avatar>
										</TableCell>
										<TableCell>
											<div className="flex flex-col">
												<span className="font-medium text-slate-900">
													{user.name}
												</span>
												<span className="text-sm text-slate-500">
													{user.email}
												</span>
											</div>
										</TableCell>
										<TableCell>
											<RoleBadge role={user.role} />
										</TableCell>
										<TableCell className="hidden md:table-cell text-slate-500">
											{formatDateTime(user.created_at)}
										</TableCell>
										<TableCell className="text-right">
											<RoleActionMenu user={user} />
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>

				<div className="mt-4 text-xs text-slate-400 text-center">
					Showing {filteredUsers.length} users
				</div>
			</div>
		</div>
	);
}

// --- SUB-COMPONENTS ---

function RoleBadge({ role }: { role: string }) {
	if (role === "ADMIN") {
		return (
			<Badge
				variant="outline"
				className="border-red-200 bg-red-50 text-red-700 gap-1 pl-1"
			>
				<ShieldAlert className="h-3 w-3" /> Admin
			</Badge>
		);
	}
	if (role === "COLLECTOR") {
		return (
			<Badge
				variant="outline"
				className="border-blue-200 bg-blue-50 text-blue-700 gap-1 pl-1"
			>
				<ShieldCheck className="h-3 w-3" /> Collector
			</Badge>
		);
	}
	return (
		<Badge
			variant="outline"
			className="border-slate-200 bg-slate-50 text-slate-700 gap-1 pl-1"
		>
			<User className="h-3 w-3" /> User
		</Badge>
	);
}

function RoleActionMenu({ user }: { user: UserData }) {
	const [openDialog, setOpenDialog] = useState(false);
	const [newRole, setNewRole] = useState(user.role);
	const queryClient = useQueryClient();

	// Mutation to update role
	const updateMutation = useMutation({
		mutationFn: (data: { userId: number; role: string }) =>
			api.patch("/admin/users", data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
			setOpenDialog(false);
			// Optional: Add toast here
		},
	});

	const handleUpdate = () => {
		updateMutation.mutate({ userId: user.id, role: newRole });
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem onClick={() => setOpenDialog(true)}>
						<Shield className="mr-2 h-4 w-4" /> Change Role
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="text-slate-500" disabled>
						View Details
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Role Change Dialog */}
			<Dialog open={openDialog} onOpenChange={setOpenDialog}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Edit User Role</DialogTitle>
						<DialogDescription>
							Change the access level for <strong>{user.name}</strong>.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="role">Select Role</Label>
							<Select
								onValueChange={(val: any) => setNewRole(val)}
								defaultValue={user.role}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="USER">User (Standard)</SelectItem>
									<SelectItem value="COLLECTOR">
										Collector (Professional)
									</SelectItem>
									<SelectItem value="ADMIN">Admin (Full Access)</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setOpenDialog(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleUpdate}
							disabled={updateMutation.isPending || newRole === user.role}
							className="bg-emerald-600 hover:bg-emerald-700"
						>
							{updateMutation.isPending ? "Saving..." : "Save Changes"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
