"use client";

import { signInEmailAction } from "@/action/auth.action";
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
import { LoginFormValues, loginSchema } from "@/lib/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const [error, setError] = useState("");
	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: LoginFormValues) => {
		setError("");
		setLoading(true);

		try {
			const response = await signInEmailAction(data, callbackUrl);
			if (response.success) {
				toast.success("Welcome back!", {
					description: response.message,
					duration: 2000,
				});
				router.push("/dashboard");
				form.reset();
			} else {
				setError(response.message || "Something went wrong");
				setLoading(false);
			}
		} catch (err) {
			setError("An error occurred. Please try again.");
			setLoading(false);
		}
	};

	return (
		<div className=" flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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

							<Button type="submit" disabled={loading} className="w-full">
								{loading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Submitting...
									</>
								) : (
									"Login"
								)}
							</Button>
						</form>
					</Form>

					<div className="mt-6 text-center text-sm">
						<span className="text-gray-600">I don't have an account? </span>
						<Link
							href="/register"
							className="text-primary hover:underline font-medium"
						>
							Create Account
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
