import { resend } from "@/lib/resend.lib";
import VerificationEmail from "../../emails/verificationEmail.emails";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: "nikhilw395@gmail.com",
      subject: "mystry box ",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return {
      success: true,
      message: "email verification successful",
    };
  } catch (error) {
    console.log("error at sendVerificationEmail", error);
    return {
      success: false,
      message: "email verification failed",
    };
  }
}
