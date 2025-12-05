import LoginForm from "@/components/forms/login-form";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Suspense } from "react";

type Props = {};

const LoginPage = async (props: Props) => {
	return (
		<div className="relative w-full">
			<MaxWidthWrapper>
				<div className="flex flex-col justify-center items-center w-full my-4">
					<h1 className="text-xl sm:text-3xl font-bold font-fjalla">Log in</h1>
				</div>
				<Suspense>
					<LoginForm />
				</Suspense>
			</MaxWidthWrapper>
		</div>
	);
};
export default LoginPage;
