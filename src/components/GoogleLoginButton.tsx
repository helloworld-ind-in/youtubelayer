"use client"

import { Button } from "@/components/ui/button";
import { APIResponse } from "@/types/APIResponse";
import axios, { AxiosError } from "axios";
import { Loader2, LogInIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function GoogleLoginButton() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const oAuthLogin = async () => {
		setIsSubmitting(true);
		try {
			const response = await axios.get("/api/oauth/auth");
			toast(response.data.message);
			if (response.status === 201) {
				router.replace(response.data.data.authUrl);
			}
		} catch (error) {
			const axiosError = error as AxiosError<APIResponse>;
			let errorMessage = axiosError.response?.data.message;
			toast(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Button onClick={() => oAuthLogin()} disabled={isSubmitting}>
			{
				isSubmitting ? (
					<><Loader2 className="animate-spin" /> Please Wait</>
				) : (
					<><LogInIcon /> Google Login</>
				)
			}
		</Button>
	);
}