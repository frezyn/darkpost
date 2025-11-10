import EmailProvider from "next-auth/providers/resend";
import { sendVerificationRequest } from "../helpers/sendEmail";

export const Email = EmailProvider({
  from: process.env.EMAIL_FROM,
  sendVerificationRequest,
})

