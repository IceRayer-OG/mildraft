import type { ReactElement } from "react";
import { Resend } from "resend";
import { env } from "~/env";

export const DEFAULT_FROM_EMAIL = "MilDraft <mildraft@siliconvalleybaseball.com>";
export const DEFAULT_REPLY_TO = "admin@siliconvalleybaseball.com";

export interface SendEmailOptions {
  from?: string;
  to: string | string[];
  subject: string;
  react: ReactElement;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string | string[];
  headers?: Record<string, string>;
}

export interface MailerResult {
  data: { id: string } | null;
  error: Error | { message: string; name: string } | null;
}

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!resendClient && env.RESEND_API_KEY) {
    resendClient = new Resend(env.RESEND_API_KEY);
  }
  return resendClient;
}

export function resolveDeliveryMode(): "production" | "mock" | "redirect" | "disabled" {
  if (env.NODE_ENV === "production") {
    // In production environment, always default to production sending unless explicitly disabled
    return env.EMAIL_DELIVERY_MODE === "disabled" ? "disabled" : "production";
  }
  // In development and test environments, use EMAIL_DELIVERY_MODE (which defaults to "mock")
  return env.EMAIL_DELIVERY_MODE;
}

export async function sendEmail(options: SendEmailOptions): Promise<MailerResult> {
  const mode = resolveDeliveryMode();
  const from = options.from ?? DEFAULT_FROM_EMAIL;
  const replyTo = options.replyTo ?? DEFAULT_REPLY_TO;
  const toList = Array.isArray(options.to) ? options.to : [options.to];

  if (mode === "disabled") {
    console.log(`[EMAIL DISABLED] Email delivery skipped for subject: "${options.subject}"`);
    return { data: { id: "disabled" }, error: null };
  }

  if (mode === "mock") {
    const recipientSummary =
      toList.length > 3
        ? `${toList.slice(0, 3).join(", ")}, +${toList.length - 3} more`
        : toList.join(", ");

    console.log(
      `[EMAIL MOCK] Intercepted email (not sent via Resend):\n` +
      `  Subject:  "${options.subject}"\n` +
      `  From:     ${from}\n` +
      `  Reply-To: ${Array.isArray(replyTo) ? replyTo.join(", ") : replyTo}\n` +
      `  To:       ${toList.length} recipient(s) [${recipientSummary}]`,
    );
    return { data: { id: `mock-${Date.now()}` }, error: null };
  }

  if (mode === "redirect") {
    if (!env.DEV_EMAIL_OVERRIDE) {
      console.warn(
        `[EMAIL REDIRECT WARNING] DEV_EMAIL_OVERRIDE is not set. Falling back to mock delivery for: "${options.subject}"`,
      );
      return { data: { id: `mock-fallback-${Date.now()}` }, error: null };
    }

    const resend = getResendClient();
    if (!resend) {
      console.warn(
        `[EMAIL REDIRECT WARNING] RESEND_API_KEY is not set. Falling back to mock delivery for: "${options.subject}"`,
      );
      return { data: { id: `mock-fallback-${Date.now()}` }, error: null };
    }

    const redirectSubject = `[DEV] ${options.subject} (intended for: ${toList.length} recipients)`;
    console.log(
      `[EMAIL REDIRECT] Redirecting email to "${env.DEV_EMAIL_OVERRIDE}". Original recipients: ${toList.length}`,
    );

    try {
      const response = await resend.emails.send({
        from,
        to: [env.DEV_EMAIL_OVERRIDE],
        subject: redirectSubject,
        react: options.react,
        replyTo,
        ...(options.headers ? { headers: options.headers } : {}),
      });

      return {
        data: response.data ? { id: response.data.id } : null,
        error: response.error,
      };
    } catch (err) {
      console.error("[EMAIL REDIRECT ERROR] Failed to send redirected email:", err);
      return {
        data: null,
        error: err instanceof Error ? err : new Error(String(err)),
      };
    }
  }

  // Production mode
  const resend = getResendClient();
  if (!resend) {
    const errorMsg = "Cannot send email in production mode: RESEND_API_KEY is missing.";
    console.error(`[EMAIL ERROR] ${errorMsg}`);
    return {
      data: null,
      error: { name: "MissingApiKey", message: errorMsg },
    };
  }

  try {
    const response = await resend.emails.send({
      from,
      to: options.to,
      subject: options.subject,
      react: options.react,
      replyTo,
      ...(options.headers ? { headers: options.headers } : {}),
      ...(options.cc ? { cc: options.cc } : {}),
      ...(options.bcc ? { bcc: options.bcc } : {}),
    });

    return {
      data: response.data ? { id: response.data.id } : null,
      error: response.error,
    };
  } catch (err) {
    console.error("[EMAIL ERROR] Resend send failed:", err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
}
