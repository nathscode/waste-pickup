import { QueryProvider } from "@/components/providers/query-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "WastePickup - Waste Management Platform",
	description: "Request and manage waste pickup services",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${inter.className} antialiased  whitespace-pre-line overscroll-none`}
			>
				<QueryProvider>
					<main className="relative flex-1 flex flex-col pt-10 font-bricolage">
						{children}
					</main>
					<Toaster position="top-center" richColors />
				</QueryProvider>
			</body>
		</html>
	);
}
