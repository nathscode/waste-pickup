"use client";

import { signInEmailAction, signUpEmailAction } from "@/action/auth.action";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RegisterFormValues, registerSchema } from "@/lib/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function RegisterForm() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const [error, setError] = useState("");
	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			phone: "",
			address: "",
		},
	});

	const onSubmit = async (data: RegisterFormValues) => {
		setError("");

		try {
			const response = await signUpEmailAction(data);
			if (response.success) {
				toast.success("Account Created!", {
					description: response.message,
					duration: 2000,
				});
				router.push("/dashboard");
				form.reset();
			} else {
				setError(response.message || "Something went wrong");
			}
		} catch (err) {
			setError("An error occurred. Please try again.");
		}
	};
	const loading = form.formState.isSubmitting;

	return (
		<div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-5">
			<Card className="w-full max-w-md">
				<CardContent>
					{error && (
						<Alert variant="destructive" className="mb-4">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input placeholder="John Doe" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email address</FormLabel>
										<FormControl>
											<Input
												placeholder="you@example.com"
												type="email"
												autoComplete="email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													placeholder="••••••••"
													type={showPassword ? "text" : "password"}
													autoComplete="new-password"
													{...field}
												/>
												<button
													type="button"
													onClick={() => setShowPassword(!showPassword)}
													className="absolute top-2 right-3 text-muted-foreground hover:text-foreground transition-colors"
													disabled={loading}
												>
													{showPassword ? (
														<EyeClosed className="h-5 w-5" />
													) : (
														<Eye className="w-5 h-5" />
													)}
												</button>
											</div>
										</FormControl>
										<FormDescription>
											Must be at least 6 characters
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone Number</FormLabel>
										<FormControl>
											<Input
												placeholder="+234 xxx xxx xxxx"
												type="tel"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="address"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Address</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Your address"
												rows={3}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" disabled={loading} className="w-full">
								{loading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creating account...
									</>
								) : (
									"Create account"
								)}
							</Button>
						</form>
					</Form>

					<div className="mt-6 text-center text-sm">
						<span className="text-gray-600">Already have an account? </span>
						<Link
							href="/login"
							className="text-primary hover:underline font-medium"
						>
							Sign in
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
