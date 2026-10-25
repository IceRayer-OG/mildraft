// next imports
import { calculateDeadline, getEffectiveStartTime } from "~/lib/date-utils";
import { inngest } from "./client";

// Database Queries
import { getDraftSettings } from "~/app/_features/leagues/database/queries";

// Use Cases
import { 
  markDraftPickOverdueUseCase, 
  startDraftPickClockUseCase,
  getNextDraftPickUseCase, 
  getCurrentDraftPickUseCase,
  getFirstDraftPickUseCase,
} from "~/app/_features/drafts/use_cases/draftUseCases";
import { sendDraftStartEmail, sendPickDeadlineEmail, sendPickTimeoutEmail } from "~/app/_features/emails/use_cases/sendUseCases";

//Types
import { type DraftStartData } from "~/app/_features/emails/utils/emails";

export const draftStart = inngest.createFunction(
  { id: "draft-start",
    cancelOn: [{
      event: "draft/draftStart.changed",
      match: "data.draftId"
    }]
   },
  { event: "draft/draft.start" },
  async ({ event, step }) => {
    await step.sleepUntil("wait-for-draft-start", event.data.draftStart);

    const firstPick = await step.run("getting-first-pick", async () => {
      const firstPickData = await getFirstDraftPickUseCase(event.data.draftId ?? 2);
      if (!firstPickData) throw new Error("No first Pick");
      return firstPickData;
    });

    await step.run("start-the-clock", async () => {
      await inngest.send({
        name: "draft/turn.started",
        data: { pickId: firstPick.pickId, draftId: event.data.draftId ?? 2 },
      });
      if (firstPick.teamName) {
        await sendDraftStartEmail(firstPick.teamName);
      }
    });
    
    return { message: `Draft started for ${event.data.leagueName}!` };
  }
);

export const handlePickTimer = inngest.createFunction(
  {
    id: "pick-timer",
    idempotency: "event.data.pickId",
    cancelOn: [{ 
      event: "draft/pick.submitted", 
      match: "data.pickId" 
    }],
  },
  { event: "draft/turn.started" },
  async ({ event, step }) => {
    const { pickId, draftId } = event.data;

    const pickDeadline = await step.run("initialize-clock", async () => {
      const draft = await getDraftSettings({ leagueId: 1, draftId: 2 });
      const durationHours = draft.pickDuration ?? 1;

      let pickStart = new Date();
      let deadline: Date;

      if (draft.draftPauseEnabled && draft.draftPauseStartTime && draft.draftPauseEndTime) {
        const pauseHour = Number(draft.draftPauseStartTime.toString().split(":")[0]);
        const resumeHour = Number(draft.draftPauseEndTime.toString().split(":")[0]);

        pickStart = getEffectiveStartTime(pickStart, pauseHour, resumeHour, "America/Los_Angeles");
        deadline = calculateDeadline(pickStart, durationHours, pauseHour, resumeHour, "America/Los_Angeles");
      } else {
        deadline = new Date(pickStart.getTime() + durationHours * 60 * 60 * 1000);
      }

      const updated = await startDraftPickClockUseCase(pickId, pickStart, deadline);
      return updated;
    });

    const pickReminder = await step.run("generate-reminder-time", async () => {
      const pickDate = new Date(pickDeadline);
      const reminderTime = new Date(pickDate.getTime() - 60 * 60 * 1000);
      const now = new Date();

      // Only schedule a 1-hour reminder if the reminder time is in the future
      if (reminderTime.getTime() > now.getTime()) {
        return reminderTime.toISOString();
      }
      return null;
    });

    if (pickReminder) {
      // One hour email reminder using inngest timer function
      await step.sleepUntil("pick-deadline-reminder", pickReminder);

      await step.run("send-pick-reminder-email", async () => {
        const currentPick = (await getCurrentDraftPickUseCase()) as DraftStartData;
        if (currentPick?.team?.name) {
          await sendPickDeadlineEmail(currentPick.team.name);
        }
      });
    }

    await step.sleepUntil("wait-for-pick-deadline", pickDeadline);

    await step.run("process-timeout", async () => {
      const timedOutPick = await markDraftPickOverdueUseCase(pickId);
      const [nextPick] = await getNextDraftPickUseCase(2);

      const emailProps = {
        pickNumber: timedOutPick?.pickNumber ?? 0,
        teamName: timedOutPick?.teamName ?? "Unknown Team",
        pickingTeam: nextPick?.teamName ?? "None (Draft Complete)",
      };

      const email = await sendPickTimeoutEmail(emailProps);
      console.log("LOG: Pick timeout email sent with response:", email.data);
      if (email.error != null) {
        console.log("Debug: Pick timeout email error:", email.error);
      }
      
      if (nextPick?.pickId != null) {
        await inngest.send({ name: "draft/turn.started", data: { pickId: nextPick.pickId, draftId } });
      }
    });
  }
);

