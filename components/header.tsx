"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type HeaderProps = {
	user?: {
		name: string;
		role: string;
	} | null;
};

export default function Header({ user }: HeaderProps) {
	const pathname = usePathname();
	const { data: session } = authClient.useSession();

	const handleLogout = async () => {
		await fetch("/api/auth/logout", { method: "POST" });
		window.location.href = "/login";
	};

	// Function to get initials from name
	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((word) => word[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<header className="bg-white border-b border-gray-200 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center space-x-8">
						<Link href="/" className="text-xl font-bold text-primary-600">
							WastePickup
						</Link>

						{session?.user && (
							<nav className="hidden md:flex space-x-4">
								{session?.user.role === "USER" && (
									<>
										<Link
											href="/dashboard"
											className={`px-3 py-2 rounded-md text-sm font-medium ${
												pathname === "/dashboard"
													? "bg-primary-50 text-primary-600"
													: "text-gray-700 hover:bg-gray-100"
											}`}
										>
											Dashboard
										</Link>
										<Link
											href="/request/new"
											className={`px-3 py-2 rounded-md text-sm font-medium ${
												pathname === "/request/new"
													? "bg-primary-50 text-primary-600"
													: "text-gray-700 hover:bg-gray-100"
											}`}
										>
											New Request
										</Link>
										<Link
											href="/profile"
											className={`px-3 py-2 rounded-md text-sm font-medium ${
												pathname === "/profile"
													? "bg-primary-50 text-primary-600"
													: "text-gray-700 hover:bg-gray-100"
											}`}
										>
											Profile
										</Link>
									</>
								)}

								{session?.user.role === "COLLECTOR" && (
									<>
										<Link
											href="/collector"
											className={`px-3 py-2 rounded-md text-sm font-medium ${
												pathname === "/collector"
													? "bg-primary-50 text-primary-600"
													: "text-gray-700 hover:bg-gray-100"
											}`}
										>
											My Assignments
										</Link>
										<Link
											href="/profile"
											className={`px-3 py-2 rounded-md text-sm font-medium ${
												pathname === "/profile"
													? "bg-primary-50 text-primary-600"
													: "text-gray-700 hover:bg-gray-100"
											}`}
										>
											Profile
										</Link>
									</>
								)}

								{session?.user.role === "ADMIN" && (
									<>
										<Link
											href="/admin"
											className={`px-3 py-2 rounded-md text-sm font-medium ${
												pathname === "/admin"
													? "bg-primary-50 text-primary-600"
													: "text-gray-700 hover:bg-gray-100"
											}`}
										>
											All Requests
										</Link>
										<Link
											href="/admin/feedback"
											className={`px-3 py-2 rounded-md text-sm font-medium ${
												pathname === "/admin/feedback"
													? "bg-primary-50 text-primary-600"
													: "text-gray-700 hover:bg-gray-100"
											}`}
										>
											All Feedbacks
										</Link>
										<Link
											href="/admin/collectors"
											className={`px-3 py-2 rounded-md text-sm font-medium ${
												pathname === "/admin/collectors"
													? "bg-primary-50 text-primary-600"
													: "text-gray-700 hover:bg-gray-100"
											}`}
										>
											Collectors
										</Link>
										<Link
											href="/admin/users"
											className={`px-3 py-2 rounded-md text-sm font-medium ${
												pathname === "/admin/users"
													? "bg-primary-50 text-primary-600"
													: "text-gray-700 hover:bg-gray-100"
											}`}
										>
											Users
										</Link>
										<Link
											href="/profile"
											className={`px-3 py-2 rounded-md text-sm font-medium ${
												pathname === "/profile"
													? "bg-primary-50 text-primary-600"
													: "text-gray-700 hover:bg-gray-100"
											}`}
										>
											Profile
										</Link>
									</>
								)}
							</nav>
						)}
					</div>

					<div className="flex items-center space-x-4">
						{session?.user ? (
							<div className="flex items-center space-x-4">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											className="relative h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
										>
											<Avatar className="h-8 w-8">
												<AvatarFallback className="bg-primary text-primary-foreground">
													{getInitials(session.user.name)}
												</AvatarFallback>
											</Avatar>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-56" align="end" forceMount>
										<DropdownMenuLabel className="font-normal">
											<div className="flex flex-col space-y-1">
												<p className="text-sm font-medium leading-none">
													{session.user.name}
												</p>
												<p className="text-xs leading-none text-muted-foreground">
													{session.user.role.charAt(0).toUpperCase() +
														session.user.role.slice(1).toLowerCase()}
												</p>
											</div>
										</DropdownMenuLabel>
										<DropdownMenuSeparator />

										{session.user.role === "USER" && (
											<>
												<DropdownMenuItem asChild>
													<Link href="/dashboard">Dashboard</Link>
												</DropdownMenuItem>
												<DropdownMenuItem asChild>
													<Link href="/request/new">New Request</Link>
												</DropdownMenuItem>
												<DropdownMenuItem asChild>
													<Link href="/profile">My Profile</Link>
												</DropdownMenuItem>
											</>
										)}

										{session.user.role === "COLLECTOR" && (
											<>
												<DropdownMenuItem asChild>
													<Link href="/collector">My Assignments</Link>
												</DropdownMenuItem>
												<DropdownMenuItem asChild>
													<Link href="/profile">My Profile</Link>
												</DropdownMenuItem>
											</>
										)}

										{session.user.role === "ADMIN" && (
											<>
												<DropdownMenuItem asChild>
													<Link href="/admin">All Requests</Link>
												</DropdownMenuItem>
												<DropdownMenuItem asChild>
													<Link href="/admin/collectors">Collectors</Link>
												</DropdownMenuItem>
												<DropdownMenuItem asChild>
													<Link href="/admin/settings">Settings</Link>
												</DropdownMenuItem>
											</>
										)}

										<DropdownMenuSeparator />
										<DropdownMenuItem
											className="text-red-600 focus:text-red-600"
											onClick={handleLogout}
										>
											Log out
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						) : (
							<>
								<Link
									href="/login"
									className="text-sm font-medium text-gray-700 hover:text-primary-600"
								>
									Login
								</Link>
								<Link
									href="/register"
									className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-md"
								>
									Register
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}
