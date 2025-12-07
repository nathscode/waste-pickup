"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface FeedbackDialogProps {
	requestId: number;
}

export function FeedbackDialog({ requestId }: FeedbackDialogProps) {
	const [open, setOpen] = useState(false);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (data: any) => api.post("/feedback", data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["request", requestId] });
			setOpen(false);
			setRating(0);
			setComment("");
			toast.success("Feedback submitted successfully");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleSubmit = () => {
		if (rating === 0) return;
		mutation.mutate({
			requestId: requestId.toString(),
			rating,
			comment,
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20">
					<Star className="mr-2 h-4 w-4" />
					Rate Service
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>How was your pickup?</DialogTitle>
					<DialogDescription>
						Your feedback helps us improve our service for everyone.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-6 py-4">
					{/* Star Rating Input */}
					<div className="flex flex-col items-center gap-2">
						<Label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
							Select Rating
						</Label>
						<div className="flex gap-1">
							{[1, 2, 3, 4, 5].map((star) => (
								<button
									key={star}
									type="button"
									onClick={() => setRating(star)}
									className={`p-1 transition-transform hover:scale-110 focus:outline-none`}
								>
									<Star
										className={`h-8 w-8 ${
											star <= rating
												? "fill-yellow-400 text-yellow-400"
												: "text-slate-300"
										}`}
									/>
								</button>
							))}
						</div>
						<span className="text-sm font-medium text-slate-600 min-h-5">
							{rating === 1 && "Poor"}
							{rating === 2 && "Fair"}
							{rating === 3 && "Good"}
							{rating === 4 && "Very Good"}
							{rating === 5 && "Excellent!"}
						</span>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="comment">Comments (Optional)</Label>
						<Textarea
							id="comment"
							placeholder="Tell us what you liked or what we can do better..."
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							className="resize-none h-24"
						/>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={rating === 0 || mutation.isPending}
						className="bg-emerald-600 hover:bg-emerald-700"
					>
						{mutation.isPending && (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						)}
						Submit Feedback
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
