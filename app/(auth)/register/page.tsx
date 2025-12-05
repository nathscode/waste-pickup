import RegisterForm from "@/components/forms/register-form";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import React from "react";

type Props = {};

const RegisterPage = async (props: Props) => {
	return (
		<div className="relative w-full">
			<MaxWidthWrapper>
				<div className="flex flex-col justify-center items-center w-full my-4">
					<h1 className="text-xl sm:text-3xl font-bold font-fjalla">
						Create account
					</h1>
					<p className="text-muted-foreground text-center text-base mt-2">
						Sign up now and start making bookings.
					</p>
				</div>
				<RegisterForm />
			</MaxWidthWrapper>
		</div>
	);
};
export default RegisterPage;
