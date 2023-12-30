import { Resend } from "resend";
import { FROM_ADDRESS, RESEND_SECRET } from "../constants";

const resend = new Resend(RESEND_SECRET!);

export const sendMail = async (to: string, subject: string, body: string) => {
  // Used resend to send email
  return await resend.emails.send({
    from: FROM_ADDRESS!,
    to,
    subject,
    html: body,
  });
};
