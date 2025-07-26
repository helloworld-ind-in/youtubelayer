import { resend } from "@/lib/resend";
import { APIResponse } from "@/types/APIResponse";
import RegistrationEmail from "./template/RegistratinEmail";

export async function SendRegistrationEmail(email: string): Promise<APIResponse> {
    try {
        const fromeEmail = "onboarding@" + process.env.RESEND_DOMAIN;
        await resend.emails.send({
            from: fromeEmail,
            to: email,
            subject: 'Welcome to YouTubeLayer.',
            react: RegistrationEmail({ email })
        });

        return {
            success: true,
            message: "Registration email sent successfully."
        }
    } catch (emailError) {
        const errorMessage = "Error in sending registration email."
        console.log("Internal Server Error: ", errorMessage);
        console.log(emailError);
        return ({
            success: false,
            message: errorMessage
        });
    }
}