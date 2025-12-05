"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

// Define the form schema with zod
const requestSchema = z.object({
	waste_type: z.string().min(1, {
		message: "Please select a waste type.",
	}),
	pickup_address: z.string().min(5, {
		message: "Address must be at least 5 characters.",
	}),
	preferred_time: z.string().optional(),
	notes: z.string().optional(),
});

// Infer the type from the schema
type RequestFormValues = z.infer<typeof requestSchema>;

const wasteTypeOptions = [
	{ value: "General Waste", label: "General Waste" },
	{ value: "Recyclables", label: "Recyclables" },
	{ value: "Organic Waste", label: "Organic Waste" },
	{ value: "Electronic Waste", label: "Electronic Waste" },
	{ value: "Hazardous Waste", label: "Hazardous Waste" },
	{ value: "Bulky Items", label: "Bulky Items" },
];

// DateTimePicker component
function DateTimePicker({
	value,
	onChange,
}: {
	value?: string;
	onChange?: (date: string | undefined) => void;
}) {
	const [open, setOpen] = useState(false);
	const [date, setDate] = useState<Date | undefined>(
		value ? new Date(value) : undefined
	);
	const [time, setTime] = useState<string>(
		value ? new Date(value).toTimeString().slice(0, 5) : ""
	);

	const handleDateSelect = (selectedDate: Date | undefined) => {
		setDate(selectedDate);
		setOpen(false);

		if (selectedDate && time) {
			const [hours, minutes] = time.split(":").map(Number);
			selectedDate.setHours(hours, minutes);
			onChange?.(selectedDate.toISOString());
		} else if (selectedDate) {
			// Default to noon if no time is selected
			selectedDate.setHours(12, 0);
			onChange?.(selectedDate.toISOString());
		}
	};

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTime = e.target.value;
		setTime(newTime);

		if (date && newTime) {
			const [hours, minutes] = newTime.split(":").map(Number);
			const newDate = new Date(date);
			newDate.setHours(hours, minutes);
			onChange?.(newDate.toISOString());
		}
	};

	return (
		<div className="flex gap-4">
			<div className="flex flex-col gap-3">
				<Label className="px-1">Date</Label>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className="w-32 justify-between font-normal"
						>
							{date ? date.toLocaleDateString() : "Select date"}
							<ChevronDownIcon className="h-4 w-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto overflow-hidden p-0" align="start">
						<Calendar
							mode="single"
							selected={date}
							captionLayout="dropdown"
							onSelect={handleDateSelect}
						/>
					</PopoverContent>
				</Popover>
			</div>
			<div className="flex flex-col gap-3">
				<Label className="px-1">Time</Label>
				<Input
					type="time"
					value={time}
					onChange={handleTimeChange}
					className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
				/>
			</div>
		</div>
	);
}

export default function NewRequestPage() {
	const router = useRouter();
	const [error, setError] = useState("");

	// Initialize the form with react-hook-form and zod resolver
	const form = useForm<RequestFormValues>({
		resolver: zodResolver(requestSchema),
		defaultValues: {
			waste_type: "",
			pickup_address: "",
			preferred_time: "",
			notes: "",
		},
	});

	// React Query mutation for form submission
	const { mutate, isPending } = useMutation({
		mutationFn: async (data: RequestFormValues) => {
			// Set default preferred_time to 2 hours from now if not provided
			const requestData = {
				...data,
				preferred_time: data.preferred_time || getDefaultDateTime(),
			};

			const response = await axios.post("/api/requests", requestData);
			return response.data;
		},
		onSuccess: (data) => {
			// Show success toast
			toast.success("Pickup request submitted successfully!", {
				description: "Your waste pickup request has been created.",
				duration: 5000, // 5 seconds
			});

			// Redirect to dashboard after 1.5 seconds
			setTimeout(() => {
				router.push("/dashboard");
			}, 1500);
		},
		onError: (error) => {
			// Handle axios errors
			if (axios.isAxiosError(error)) {
				const errorMessage =
					error.response?.data?.error ||
					error.response?.data?.message ||
					"Failed to create pickup request";

				setError(errorMessage);

				// Show error toast
				toast.error("Submission failed", {
					description: errorMessage,
					duration: 5000, // 5 seconds
				});
			} else {
				const errorMessage = "An unexpected error occurred. Please try again.";
				setError(errorMessage);

				toast.error("Submission failed", {
					description: errorMessage,
					duration: 5000,
				});
			}
		},
	});

	// Function to get default date time (2 hours from now)
	const getDefaultDateTime = () => {
		const now = new Date();
		now.setHours(now.getHours() + 2);
		return now.toISOString();
	};

	const onSubmit = (data: RequestFormValues) => {
		setError("");
		mutate(data);
	};

	return (
		<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">New Pickup Request</h1>
				<p className="text-muted-foreground mt-1">
					Fill in the details for your waste pickup
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Pickup Request Details</CardTitle>
					<CardDescription>
						Please provide the necessary information for your waste pickup
						request
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="waste_type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Waste Type *</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select waste type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{wasteTypeOptions.map((option) => (
													<SelectItem key={option.value} value={option.value}>
														{option.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="pickup_address"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Pickup Address *</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Enter the full address where waste should be picked up"
												rows={3}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="preferred_time"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Preferred Pickup Time</FormLabel>
										<FormControl>
											<DateTimePicker
												value={field.value}
												onChange={field.onChange}
											/>
										</FormControl>
										<FormDescription>
											Select your preferred date and time for pickup. If not
											selected, default will be 2 hours from now.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="notes"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Additional Notes</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Any additional information or special instructions..."
												rows={4}
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Optional: Provide any special instructions or additional
											information
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex space-x-4">
								<Button type="submit" disabled={isPending} className="flex-1">
									{isPending ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Submitting...
										</>
									) : (
										"Submit Request"
									)}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => router.back()}
								>
									Cancel
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
