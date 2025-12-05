import * as z from "zod";

export const registerSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	email: z.email({
		message: "Please enter a valid email address.",
	}),
	password: z.string().min(6, {
		message: "Password must be at least 6 characters.",
	}),
	phone: z.string().optional(),
	address: z.string().optional(),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
	email: z.email({
		message: "Please enter a valid email address.",
	}),
	password: z.string().min(6, {
		message: "Password must be at least 6 characters.",
	}),
});

// Infer the type from the schema
export type LoginFormValues = z.infer<typeof loginSchema>;
