"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	User,
	Mail,
	Phone,
	MapPin,
	LogOut,
	Shield,
	Trash2,
	Loader2,
} from "lucide-react";

type UserProfile = {
	id: number;
	name: string;
	email: string;
	role: string;
	address: string | null;
	phone: string | null;
	createdAt: string;
};

export default function ProfilePage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [user, setUser] = useState<UserProfile | null>(null);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	// Form state
	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		address: "",
	});

	useState(() => {
		fetchProfile();
	});

	async function fetchProfile() {
		try {
			const res = await fetch("/api/profile");
			if (res.ok) {
				const data = await res.json();
				setUser(data);
				setFormData({
					name: data.name || "",
					phone: data.phone || "",
					address: data.address || "",
				});
			}
		} catch (err) {
			setError("Failed to load profile");
		} finally {
			setLoading(false);
		}
	}

	// Handle profile update
	async function handleUpdateProfile(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setSuccess("");
		setSaving(true);

		try {
			const res = await fetch("/api/profile", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error || "Failed to update profile");
				setSaving(false);
				return;
			}

			setUser(data.user);
			setSuccess("Profile updated successfully!");
			setTimeout(() => setSuccess(""), 3000);
		} catch (err) {
			setError("An error occurred. Please try again.");
		} finally {
			setSaving(false);
		}
	}

	async function handleDeleteAccount() {
		setDeleting(true);
		setError("");

		try {
			const res = await fetch("/api/profile", {
				method: "DELETE",
			});

			if (res.ok) {
				router.push("/login");
			} else {
				const data = await res.json();
				setError(data.error || "Failed to delete account");
				setDeleting(false);
				setShowDeleteDialog(false);
			}
		} catch (err) {
			setError("An error occurred. Please try again.");
			setDeleting(false);
			setShowDeleteDialog(false);
		}
	}

	// Handle logout
	async function handleLogout() {
		await fetch("/api/auth/logout", { method: "POST" });
		router.push("/login");
	}

	if (loading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary-600" />
			</div>
		);
	}

	if (!user) return null;

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl space-y-8">
				{/* Header Section */}
				<div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
						<p className="mt-1 text-gray-600">
							Manage your account settings and preferences.
						</p>
					</div>
					<button
						onClick={handleLogout}
						className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
					>
						<LogOut className="h-4 w-4" /> Sign Out
					</button>
				</div>

				{/* Success/Error Messages */}
				{success && (
					<div className="rounded-lg bg-green-50 border border-green-200 p-4">
						<p className="text-sm text-green-800">{success}</p>
					</div>
				)}

				{error && (
					<div className="rounded-lg bg-red-50 border border-red-200 p-4">
						<p className="text-sm text-red-800">{error}</p>
					</div>
				)}

				<div className="grid gap-8 md:grid-cols-3">
					{/* Left Column: User Card */}
					<div className="md:col-span-1">
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
							<div className="text-center mb-6">
								<div className="mx-auto mb-4 relative w-24 h-24">
									<div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-3xl font-bold text-primary-600 border-4 border-white shadow-sm">
										{user.name?.charAt(0).toUpperCase()}
									</div>
									<span className="absolute bottom-0 right-0 h-6 w-6 rounded-full border-2 border-white bg-green-500"></span>
								</div>
								<h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
								<span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
									{user.role} Account
								</span>
							</div>

							<div className="space-y-4">
								<div className="flex items-center gap-3 text-sm text-gray-600">
									<Mail className="h-4 w-4" />
									<span className="truncate">{user.email}</span>
								</div>
								{user.phone && (
									<div className="flex items-center gap-3 text-sm text-gray-600">
										<Phone className="h-4 w-4" />
										<span>{user.phone}</span>
									</div>
								)}
								<div className="flex items-center gap-3 text-sm text-gray-600">
									<Shield className="h-4 w-4" />
									<span>
										Member since {new Date(user.createdAt).getFullYear()}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column: Forms */}
					<div className="md:col-span-2 space-y-6">
						{/* Personal Information Form */}
						<div className="bg-white rounded-lg shadow-sm border border-gray-200">
							<div className="p-6 border-b border-gray-200">
								<h3 className="text-lg font-semibold text-gray-900">
									Personal Information
								</h3>
								<p className="text-sm text-gray-600 mt-1">
									Update your contact details here.
								</p>
							</div>

							<form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
								<div className="grid gap-4 sm:grid-cols-2">
									<div className="space-y-2">
										<label
											htmlFor="name"
											className="block text-sm font-medium text-gray-700"
										>
											Full Name *
										</label>
										<div className="relative">
											<User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
											<input
												id="name"
												type="text"
												required
												value={formData.name}
												onChange={(e) =>
													setFormData({ ...formData, name: e.target.value })
												}
												className="w-full pl-9 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
											/>
										</div>
									</div>

									<div className="space-y-2">
										<label
											htmlFor="phone"
											className="block text-sm font-medium text-gray-700"
										>
											Phone Number
										</label>
										<div className="relative">
											<Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
											<input
												id="phone"
												type="tel"
												value={formData.phone}
												onChange={(e) =>
													setFormData({ ...formData, phone: e.target.value })
												}
												placeholder="+234 xxx xxx xxxx"
												className="w-full pl-9 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
											/>
										</div>
									</div>
								</div>

								<div className="space-y-2">
									<label
										htmlFor="address"
										className="block text-sm font-medium text-gray-700"
									>
										Default Address
									</label>
									<div className="relative">
										<MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
										<input
											id="address"
											type="text"
											value={formData.address}
											onChange={(e) =>
												setFormData({ ...formData, address: e.target.value })
											}
											placeholder="123 Green Street..."
											className="w-full pl-9 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
										/>
									</div>
								</div>

								<div className="flex justify-end pt-2">
									<button
										type="submit"
										disabled={saving}
										className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
									>
										{saving ? (
											<>
												<Loader2 className="h-4 w-4 animate-spin" />
												Saving...
											</>
										) : (
											"Save Changes"
										)}
									</button>
								</div>
							</form>
						</div>

						{/* Danger Zone */}
						<div className="bg-white rounded-lg shadow-sm border border-red-200">
							<div className="p-6 border-b border-red-200">
								<h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
									<Trash2 className="h-5 w-5" /> Danger Zone
								</h3>
							</div>

							<div className="p-6">
								<div className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 p-4">
									<div>
										<p className="font-medium text-red-900">Delete Account</p>
										<p className="text-sm text-red-700">
											Permanently remove your data and all requests.
										</p>
									</div>
									<button
										onClick={() => setShowDeleteDialog(true)}
										className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
									>
										Delete
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Delete Confirmation Dialog */}
			{showDeleteDialog && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
								<Trash2 className="h-6 w-6 text-red-600" />
							</div>
							<div>
								<h3 className="text-lg font-semibold text-gray-900">
									Delete Account
								</h3>
								<p className="text-sm text-gray-600">
									Are you absolutely sure?
								</p>
							</div>
						</div>

						<div className="mb-6">
							<p className="text-sm text-gray-700">
								This action cannot be undone. This will permanently delete your
								account and remove all your data including:
							</p>
							<ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
								<li>Your profile information</li>
								<li>All your pickup requests</li>
								<li>Your request history</li>
							</ul>
						</div>

						<div className="flex gap-3 justify-end">
							<button
								onClick={() => setShowDeleteDialog(false)}
								disabled={deleting}
								className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={handleDeleteAccount}
								disabled={deleting}
								className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
							>
								{deleting ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										Deleting...
									</>
								) : (
									<>
										<Trash2 className="h-4 w-4" />
										Yes, delete my account
									</>
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
