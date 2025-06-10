import { resend } from "@/lib/resend";
import { APIResponse } from "@/types/APIResponse";
import VerificationEmail from "./template/VerificationEmail";

export async function SendVerificationEmail(
    email: string,
    verificationCode: string
): Promise<APIResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@mail.youtubelayer.in',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({email, verificationCode})
        });

        return {
            success: true,
            message: "Verification email sent successfully."
        }
    } catch (emailError) {
        const errorMessage = "Error in sending verification email."
        console.log("Internal Server Error: ", errorMessage);
        console.log(emailError);
        return({
            success: false,
            message: errorMessage
        });
    }
}