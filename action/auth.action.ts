"use server";
import db from "@/db";
import { user } from "@/db/schema";
import { auth, ErrorCode } from "@/lib/auth";
import { trimAndLowercase } from "@/lib/utils";
import { loginSchema, registerSchema } from "@/lib/validators/auth";
import { APIError } from "better-auth/api";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import type { z } from "zod";

type ActionResponse<T> = {
	success: boolean;
	message?: string;
	redirectTo?: string;
	validationErrors?: z.ZodFlattenedError<T>["fieldErrors"];
};

export async function signUpEmailAction(
	values: z.infer<typeof registerSchema>
): Promise<ActionResponse<z.infer<typeof registerSchema>>> {
	const validatedFields = registerSchema.safeParse(values);
	if (!validatedFields.success) {
		return {
			success: false,
			message: "Invalid fields provided. Please check the errors.",
			validationErrors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { name, email, password, phone, address } = validatedFields.data;
	let formattedName = "user";
	let formattedEmail = trimAndLowercase(email);
	if (name) {
		formattedName = trimAndLowercase(name);
	}

	// Call the BetterAuth API
	try {
		const signUpResult = await auth.api.signUpEmail({
			headers: await headers(),
			body: {
				email: formattedEmail,
				password,
				name: formattedName,
			},
		});

		let userId: string;
		if (signUpResult && "user" in signUpResult && signUpResult.user?.id) {
			userId = signUpResult.user.id;
		} else {
			const userRecord = await db.query.user.findFirst({
				where: eq(user.email, email),
				columns: { id: true },
			});
			if (!userRecord) {
				throw new Error("Failed to retrieve created user");
			}
			userId = userRecord.id;
		}

		await db
			.update(user)
			.set({
				phone: phone,
				address: address,
				isActive: true,
				emailVerified: true,
				updatedAt: new Date(),
			})
			.where(eq(user.id, userId));

		return {
			success: true,
			redirectTo: `/dashboard`,
			message: "Account created successfully. You can now create bookings.",
		};
	} catch (err) {
		// Handle errors from the API
		if (err instanceof APIError) {
			return { success: false, message: err.message };
		}
		console.error("Sign Up Error:", err);
		return { success: false, message: "An unexpected error occurred." };
	}
}

export async function signInEmailAction(
	values: z.infer<typeof loginSchema>,
	callbackUrl: string | null
): Promise<ActionResponse<z.infer<typeof loginSchema>>> {
	const validatedFields = loginSchema.safeParse(values);
	if (!validatedFields.success) {
		return {
			success: false,
			message: "Invalid fields provided.",
			validationErrors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { email, password } = validatedFields.data;

	try {
		const userData = await auth.api.signInEmail({
			headers: await headers(),
			body: { email, password },
		});

		// Fetch user details from database to check ban and active status
		const dbUser = await db.query.user.findFirst({
			where: eq(user.id, userData.user.id),
			columns: {
				id: true,
				banned: true,
				isActive: true,
			},
		});

		// Check if user exists in database
		if (!dbUser) {
			return {
				success: false,
				message: "User account not found. Please try again.",
			};
		}
		if (dbUser.banned) {
			return {
				success: false,
				message:
					"Your account is banned. Please contact support for assistance.",
			};
		}
		if (!dbUser.isActive) {
			return {
				success: false,
				message: "Your account has been deactivated. Please contact support.",
			};
		}

		return {
			success: true,
			redirectTo: "/dashboard",
			message: "Signed in successfully.",
		};
	} catch (err) {
		if (err instanceof APIError) {
			const errCode = err.body?.code as ErrorCode | undefined;
			switch (errCode) {
				case "EMAIL_NOT_VERIFIED":
					return {
						success: false,
						redirectTo: `/auth/verify?email=${email}`,
						message: "Please verify your email address to continue.",
					};
				default:
					return { success: false, message: err.message };
			}
		}

		console.error("Sign In Error:", err);
		return { success: false, message: "An internal server error occurred." };
	}
}
