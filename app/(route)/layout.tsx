import Header from "@/components/header";

export default async function MainAppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative w-full mx-auto p-0">
			<Header />
			<main className="overflow-hidden pt-20">{children}</main>
		</div>
	);
}
