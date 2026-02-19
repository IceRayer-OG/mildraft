import { Resend } from "resend";
import DraftPickEmail from "~/emails/draft_pick";

import { type DraftPickEmailProps } from "../utils/emails";
import { getDraftPickEmails } from "../../drafts/database/teamQueries";
import DraftStartEmail from "~/emails/draft_start";
import DraftReminderEmail from "~/emails/one_hour";
import { getCurrentDraftPick } from "../../drafts/database/queries";

const resend = new Resend(process.env.RESEND_API_KEY);

async function getLeagueEmails() {
  const draftPickEmails = await getDraftPickEmails();
  const emails = draftPickEmails.map(email => `${email.teamName} <${email.teamEmail}>`);
  return emails;
}

export async function sendDraftStartEmail(pickingTeamName: string) {
  const emails = await getLeagueEmails();

  const { data, error } = await resend.emails.send({
    from: "No-Reply <no-reply@siliconvalleybaseball.com>",
    // to: emails, //used for production
    to: ["Slump Busters <matthew.dowling3@gmail.com>"], // used for testing
    subject: "2026 SVBB MiL Draft Start",
    react: DraftStartEmail({ pickingTeam: pickingTeamName }),
  });

  console.log("Sending draft start email...");
}

export async function sendPickDeadlineEmail(pickingTeamName: string) {
  // Get the current picking email
  const email = await getCurrentDraftPick().then(email => {
    if(!email?.team?.email) return "Slump Busters <matthew.dowling3@gmail.com>";
    return `${email.team.name} <${email.team.email}>`;
  });

  const { data, error } = await resend.emails.send({
    from: "No-Reply <no-reply@siliconvalleybaseball.com>",
    // to: email, //used for production
    to: ["Slump Busters <matthew.dowling3@gmail.com>"], // used for testing
    subject: "2026 SVBB MiL Draft Pick Reminder",
    react: DraftReminderEmail({ timeRemaining: 1 }),
  });
  
  // Implement the logic to send an email when a pick deadline is approaching
  console.log("Sending pick deadline email...");
}

export async function sendPickTimeoutEmail() {
  // Implement the logic to send an email when a pick has timed out
  console.log("Sending pick timeout email...");
}

export async function sendPickMadeEmail(emailprops: DraftPickEmailProps) {
  const emails = await getLeagueEmails();

  const { data, error } = await resend.emails.send({
    from: "No-Reply <no-reply@siliconvalleybaseball.com>",
    // to: emails, //used for production
    to: ["Slump Busters <matthew.dowling3@gmail.com>"], // used for testing
    subject: "SVBB MiL Draft Pick Completed",
    react: DraftPickEmail(emailprops),
  });
  // Implement the logic to send an email when a pick is made
  console.log("Sending pick made email...");
}

export async function sendDraftPauseEmail() {
  // Implement the logic to send an email when the draft is paused
  console.log("Sending draft pause email...");
}

export async function sendDraftResumeEmail() {
  // Implement the logic to send an email when the draft is resumed
  console.log("Sending draft resume email...");
}

export async function sendDraftCompletionEmail() {
  // Implement the logic to send an email when the draft is completed
  console.log("Sending draft completion email...");
}

export async function sendDraftSummaryEmail() {
  // Implement the logic to send a summary email after the draft is completed
  console.log("Sending draft summary email...");
}
