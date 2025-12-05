import Link from "next/link";
import {
	ArrowRight,
	CheckCircle2,
	Clock,
	Globe,
	Leaf,
	MapPin,
	Phone,
	ShieldCheck,
	Trash2,
	Truck,
} from "lucide-react";
import MaxWidthWrapper from "@/components/max-width-wrapper";

export default async function Home() {
	return (
		<div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
			<MaxWidthWrapper>
				{/* 1. HERO SECTION: Split layout for better visual balance */}
				<section className="relative overflow-hidden  pb-20 lg:pb-28">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
							{/* Left Column: Text */}
							<div className="max-w-2xl">
								<div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-emerald-800 mb-8">
									<span className="relative flex h-3 w-3">
										<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
										<span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
									</span>
									<span className="text-sm font-semibold tracking-wide uppercase">
										Available in your area
									</span>
								</div>

								<h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-8 text-slate-900 leading-[1.1]">
									Waste pickup, <br />
									<span className="text-emerald-600">reimagined.</span>
								</h1>

								<p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
									The easiest way to manage household and commercial waste. Book
									a truck, track the driver, and pay securely—all in one place.
								</p>

								<div className="flex flex-col sm:flex-row gap-4">
									<Link
										href="/register"
										className="inline-flex items-center justify-center h-14 px-8 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-all hover:scale-[1.02]"
									>
										Book a Pickup
										<ArrowRight className="ml-2 h-5 w-5" />
									</Link>
									<Link
										href="/login"
										className="inline-flex items-center justify-center h-14 px-8 rounded-2xl bg-white border-2 border-slate-200 text-slate-900 font-bold text-lg hover:border-slate-300 hover:bg-slate-50 transition-all"
									>
										Log In
									</Link>
								</div>

								{/* Trust Indicators */}
								<div className="mt-10 flex items-center gap-4 text-sm text-slate-500 font-medium">
									<div className="flex -space-x-2">
										{[1, 2, 3, 4].map((i) => (
											<div
												key={i}
												className="h-10 w-10 rounded-full border-2 border-white bg-slate-200"
											/>
										))}
									</div>
									<p>Trusted by 10,000+ neighbors</p>
								</div>
							</div>

							{/* Right Column: Visual/Abstract */}
							<div className="relative hidden lg:block">
								<div className="relative rounded-[2.5rem] bg-emerald-600 p-12 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
									<div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-yellow-300 opacity-50 blur-3xl"></div>
									<div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-32 w-32 rounded-full bg-blue-300 opacity-50 blur-3xl"></div>

									<div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
										<div className="flex items-center gap-4 mb-4">
											<div className="bg-emerald-100 p-3 rounded-full">
												<Truck className="h-6 w-6 text-emerald-600" />
											</div>
											<div>
												<h3 className="font-bold text-lg">Pickup Arriving</h3>
												<p className="text-slate-500">Usually within 2 hours</p>
											</div>
										</div>
										<div className="h-2 bg-slate-100 rounded-full overflow-hidden">
											<div className="h-full w-3/4 bg-emerald-500 rounded-full"></div>
										</div>
									</div>

									<div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-white border border-white/20">
										<div className="flex justify-between items-center">
											<div>
												<p className="text-emerald-100 text-sm">
													Total Recycled
												</p>
												<p className="text-3xl font-bold">1,240 kg</p>
											</div>
											<Leaf className="h-10 w-10 text-emerald-300" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</MaxWidthWrapper>

			{/* 2. STATS BAR: Social Proof */}
			<section className="border-y border-slate-200 bg-white">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
						{[
							{ label: "Active Cities", value: "12+" },
							{ label: "Pickups Done", value: "50k+" },
							{ label: "User Rating", value: "4.9/5" },
							{ label: "Support", value: "24/7" },
						].map((stat, i) => (
							<div key={i} className="py-8 text-center">
								<div className="text-3xl sm:text-4xl font-black text-slate-900">
									{stat.value}
								</div>
								<div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mt-1">
									{stat.label}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* 3. BENTO GRID FEATURES: Modern & Clean */}
			<section className="py-24 bg-white">
				<MaxWidthWrapper>
					<div className="container mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center max-w-3xl mx-auto mb-16">
							<h2 className="text-4xl font-bold text-slate-900 mb-4">
								Everything you need to manage waste
							</h2>
							<p className="text-xl text-slate-600">
								We built a platform that works for everyone. Whether you are
								tech-savvy or just want the job done.
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{/* Large Card */}
							<div className="md:col-span-2 rounded-[2.5rem] bg-slate-50 p-8 sm:p-12 border border-slate-100 flex flex-col justify-between hover:border-emerald-200 transition-colors">
								<div>
									<div className="h-14 w-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
										<MapPin className="h-7 w-7" />
									</div>
									<h3 className="text-2xl font-bold text-slate-900 mb-3">
										Real-Time Tracking
									</h3>
									<p className="text-lg text-slate-600 max-w-md">
										Know exactly where your driver is. No more waiting around
										all day wondering when the truck will arrive.
									</p>
								</div>
								<div className="mt-8 h-48 bg-blue-50 rounded-3xl border border-blue-100 w-full relative overflow-hidden flex items-center justify-center">
									<span className="text-blue-300 font-bold text-4xl select-none opacity-20">
										LIVE MAP UI
									</span>
								</div>
							</div>

							{/* Tall Card */}
							<div className="md:row-span-2 rounded-[2.5rem] bg-emerald-600 p-8 sm:p-12 text-white flex flex-col justify-between">
								<div>
									<div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-6 backdrop-blur-sm">
										<Leaf className="h-7 w-7" />
									</div>
									<h3 className="text-2xl font-bold mb-3">
										Eco-Friendly Impact
									</h3>
									<p className="text-emerald-100 text-lg leading-relaxed">
										We sort your waste to ensure maximum recyclability. Join us
										in creating a greener future for the next generation.
									</p>
								</div>
								<div className="mt-8 pt-8 border-t border-white/20">
									<div className="text-5xl font-bold mb-2">85%</div>
									<div className="text-emerald-200">
										Of collected waste is recycled
									</div>
								</div>
							</div>

							{/* Small Card 1 */}
							<div className="rounded-[2.5rem] bg-slate-50 p-8 border border-slate-100 hover:border-emerald-200 transition-colors">
								<div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-4">
									<Clock className="h-6 w-6" />
								</div>
								<h3 className="text-xl font-bold text-slate-900 mb-2">
									Instant Scheduling
								</h3>
								<p className="text-slate-600">
									Book for today, tomorrow, or next week.
								</p>
							</div>

							{/* Small Card 2 */}
							<div className="rounded-[2.5rem] bg-slate-50 p-8 border border-slate-100 hover:border-emerald-200 transition-colors">
								<div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
									<ShieldCheck className="h-6 w-6" />
								</div>
								<h3 className="text-xl font-bold text-slate-900 mb-2">
									Secure Payments
								</h3>
								<p className="text-slate-600">
									Cashless, receipted, and completely safe.
								</p>
							</div>
						</div>
					</div>
				</MaxWidthWrapper>
			</section>

			{/* 4. HOW IT WORKS: Simple Steps */}
			<section className="py-24 bg-slate-900 text-white">
				<MaxWidthWrapper>
					<div className="container mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid lg:grid-cols-2 gap-16 items-center">
							<div>
								<h2 className="text-4xl font-bold mb-6">How it works</h2>
								<p className="text-xl text-slate-400 mb-12">
									No complicated forms. No hidden fees. Just 3 simple steps to a
									cleaner space.
								</p>

								<div className="space-y-8">
									<div className="flex gap-6">
										<div className="flex-none h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-emerald-900/50">
											1
										</div>
										<div>
											<h3 className="text-2xl font-bold mb-2">
												Snap a picture
											</h3>
											<p className="text-slate-400 text-lg">
												Take a photo of your waste or describe it in the app.
											</p>
										</div>
									</div>
									<div className="flex gap-6">
										<div className="flex-none h-12 w-12 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xl text-white">
											2
										</div>
										<div>
											<h3 className="text-2xl font-bold mb-2">Get a price</h3>
											<p className="text-slate-400 text-lg">
												Receive an instant, upfront quote based on volume.
											</p>
										</div>
									</div>
									<div className="flex gap-6">
										<div className="flex-none h-12 w-12 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xl text-white">
											3
										</div>
										<div>
											<h3 className="text-2xl font-bold mb-2">We pick it up</h3>
											<p className="text-slate-400 text-lg">
												Our team arrives, loads it up, and cleans the area.
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Decorative Visual */}
							<div className="bg-slate-800 rounded-4xl p-8 lg:p-12 border border-slate-700">
								<div className="flex items-center gap-4 mb-8">
									<div className="h-3 w-3 rounded-full bg-red-500" />
									<div className="h-3 w-3 rounded-full bg-yellow-500" />
									<div className="h-3 w-3 rounded-full bg-green-500" />
								</div>
								<div className="space-y-4">
									<div className="h-4 bg-slate-700 rounded w-3/4"></div>
									<div className="h-4 bg-slate-700 rounded w-1/2"></div>
									<div className="h-32 bg-slate-700 rounded-xl w-full mt-8 flex items-center justify-center">
										<Trash2 className="h-12 w-12 text-slate-600" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</MaxWidthWrapper>
			</section>

			{/* 5. FAQ SECTION: For Clarity */}
			<section className="py-24 bg-white">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
					<h2 className="text-3xl font-bold text-center mb-12">
						Common Questions
					</h2>
					<div className="space-y-4">
						{[
							{
								q: "Do I need to be home for the pickup?",
								a: "Not at all! As long as the waste is accessible, our team can pick it up and send you a photo confirmation.",
							},
							{
								q: "What kind of items do you take?",
								a: "We take almost everything: household junk, furniture, appliances, yard waste, and construction debris.",
							},
							{
								q: "Is there a discount?",
								a: "Yes! We offer a 10% discount for the first month subscription Just select the option in your profile.",
							},
						].map((item, i) => (
							<div
								key={i}
								className="p-6 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 transition-all shadow-sm"
							>
								<h3 className="text-lg font-bold text-slate-900 mb-2">
									{item.q}
								</h3>
								<p className="text-slate-600">{item.a}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* 6. BIG FOOTER CTA */}
			<section className="py-20 px-4">
				<div className="container mx-auto">
					<div className="bg-emerald-600 rounded-[3rem] px-6 py-20 text-center relative overflow-hidden">
						{/* Background Pattern */}
						<div className="absolute top-0 left-0 w-full h-full opacity-10">
							<svg
								className="w-full h-full"
								viewBox="0 0 100 100"
								preserveAspectRatio="none"
							>
								<path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
							</svg>
						</div>

						<div className="relative z-10 max-w-2xl mx-auto">
							<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
								Ready to clear the clutter?
							</h2>
							<p className="text-emerald-100 text-xl mb-10">
								Join thousands of happy customers. Download the app or sign up
								online today.
							</p>
							<div className="flex flex-col sm:flex-row justify-center gap-4">
								<Link
									href="/register"
									className="inline-flex items-center justify-center h-16 px-10 rounded-full bg-white text-emerald-900 font-bold text-xl hover:bg-emerald-50 transition-colors shadow-xl"
								>
									Get Started Free
								</Link>
								<button className="inline-flex items-center justify-center h-16 px-10 rounded-full bg-emerald-700 text-white font-bold text-xl hover:bg-emerald-800 transition-colors border border-emerald-500">
									<Phone className="mr-2 h-5 w-5" />
									Call Support
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-12 bg-white text-center text-slate-500">
				<div className="flex items-center justify-center gap-2 mb-4 text-emerald-600 font-bold text-xl">
					<Globe className="h-6 w-6" /> WastePickup
				</div>
				<p>
					&copy; {new Date().getFullYear()} WastePickup Inc. All rights
					reserved.
				</p>
			</footer>
		</div>
	);
}
