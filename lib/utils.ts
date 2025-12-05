import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
	return clsx(inputs);
}

export function formatDate(date: Date | string): string {
	return new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export function formatDateTime(date: Date | string): string {
	return new Date(date).toLocaleString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function getStatusColor(status: string): string {
	const colors: Record<string, string> = {
		pending: "bg-yellow-100 text-yellow-800",
		assigned: "bg-blue-100 text-blue-800",
		in_progress: "bg-purple-100 text-purple-800",
		completed: "bg-green-100 text-green-800",
		cancelled: "bg-red-100 text-red-800",
	};
	return colors[status] || "bg-gray-100 text-gray-800";
}

export function getStatusLabel(status: string): string {
	const labels: Record<string, string> = {
		pending: "Pending",
		assigned: "Assigned",
		in_progress: "In Progress",
		completed: "Completed",
		cancelled: "Cancelled",
	};
	return labels[status] || status;
}

export function normalizeName(name: string) {
	return name
		.trim()
		.replace(/\s+/g, " ")
		.replace(/[^a-zA-Z\s'-]/g, "")
		.replace(/\b\w/g, (char) => char.toUpperCase());
}

export const VALID_DOMAINS = () => {
	const domains = ["gmail.com", "yahoo.com", "outlook.com"];

	if (process.env.NODE_ENV === "development") {
		domains.push("example.com");
	}

	return domains;
};

export function trimAndLowercase(inputString: string): string {
	return inputString.trim().toLowerCase();
}
export function trimAndUppercase(inputString: string): string {
	return inputString.trim().toUpperCase();
}
