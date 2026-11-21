import { EmailTemplate } from "~/emails/email-template";
import { sendEmail } from "~/app/_features/emails/utils/mailer";

export async function POST() {
  try {
    const { data, error } = await sendEmail({
      from: "Acme <onboarding@resend.dev>",
      to: ["matthew.dowling3@gmail.com"],
      subject: "Hello world",
      react: EmailTemplate({ firstName: "Matt" }),
    });

    if (error) {
      return Response.json(
        {
          type: "about:blank",
          title: "Email Send Error",
          status: 500,
          detail: "message" in error ? error.message : "Failed to send email",
        },
        {
          status: 500,
          headers: { "Content-Type": "application/problem+json" },
        },
      );
    }

    return Response.json(data);
  } catch (error) {
    return Response.json(
      {
        type: "about:blank",
        title: "Internal Server Error",
        status: 500,
        detail: error instanceof Error ? error.message : "Unexpected error sending email",
      },
      {
        status: 500,
        headers: { "Content-Type": "application/problem+json" },
      },
    );
  }
}