// next imports
import { calculateDeadline } from "~/lib/date-utils";
import { inngest } from "./client";

// Database Queries
import { getDraftSettings } from "~/app/_features/leagues/database/queries";

// Use Cases
import { 
  markDraftPickOverdueUseCase, 
  startDraftPickClockUseCase,
  getNextDraftPickUseCase, 
  getCurrentDraftPickUseCase
} from "~/app/_features/drafts/use_cases/draftUseCases";
import { sendDraftStartEmail, sendPickDeadlineEmail, sendPickTimeoutEmail } from "~/app/_features/emails/use_cases/sendUseCases";

//Types
import { type DraftStartData } from "~/app/_features/emails/utils/emails";
import { Send } from "lucide-react";

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
      const firstPickData = await getCurrentDraftPickUseCase()
      if(!firstPickData) throw new Error("No first Pick")
      return firstPickData as DraftStartData;
    });

    await step.run("start-the-clock", async () => {
      await inngest.send({name: 'draft/turn.started', data: { pickId: firstPick.draft_pick.id, draftId: 2 }});
      await sendDraftStartEmail(firstPick.team.name);
    })
    
    return { message: `Draft started for ${event.data.leagueName}!` };
  }
);

export const handlePickTimer = inngest.createFunction(
  { id: "pick-timer", 
    cancelOn: [{ 
      event: "draft/pick.submitted", 
      match: "data.pickId" 
    }]},
  { event: "draft/turn.started" },
  async ({ event, step }) => {
    const { pickId, draftId } = event.data;

    const pickDeadline = await step.run("initialize-clock", async () => {
      const draft = await getDraftSettings({ leagueId: 1, draftId: 2 });
      const pickStart = await new Date()
      const deadline = await calculateDeadline(pickStart, draft.pickDuration, Number(draft.draftPauseEndTime.toString().split(":")[0]), Number(draft.draftPauseStartTime.toString().split(":")[0]), "America/Los_Angeles");
      const updated = await startDraftPickClockUseCase(pickId, pickStart, deadline);
      return updated;
    });

    const pickReminder = await step.run("generate-reminder-time", async () => {
      const pickDate = new Date(pickDeadline);
      const reminderTime = new Date(pickDate.getTime() - 60 * 60 *1000).toISOString();
      return reminderTime;
    });

    // Insert one hour email remider here using inngest timer function
    await step.sleepUntil("pick-deadline-reminder", pickReminder);

    await step.run("send-pick-reminder-email", async () => {
      const currentPick = await getCurrentDraftPickUseCase() as DraftStartData;
      await sendPickDeadlineEmail(currentPick.team.name);
    });

    await step.sleepUntil("wait-for-pick-deadline", pickDeadline);

    await step.run("process-timeout", async () => {
      await markDraftPickOverdueUseCase(pickId);
      const [nextPick] = await getNextDraftPickUseCase(2);

      if(!nextPick) {
        throw new Error("No more picks in the draft.");
      }
      const emailProps = {
        pickNumber: nextPick?.pickNumber || 0,
        teamName: nextPick?.teamName || "Unknown Team",
        pickingTeam: nextPick?.teamName || "Unknown Team",
      }

      const email = await sendPickTimeoutEmail(emailProps);
      console.log("LOG: Pick timeout email sent with response:", email.data);
      if(email.error != null) {console.log("Debug: Pick timeout email error:", email.error)};
      
      if (nextPick != undefined) {
        await inngest.send({ name: "draft/turn.started", data: { pickId: nextPick?.pickId, draftId } });
      }
    });
  }
);