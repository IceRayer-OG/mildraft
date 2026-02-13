import { calculateDeadline } from "~/lib/date-utils";
import { inngest } from "./client";
import { getDraftSettings } from "~/app/_features/leagues/database/queries";
import { 
  markDraftPickOverduUseCase, 
  startDraftPickClockUseCase,
  getNextDraftPickUseCase 
} from "~/app/_features/drafts/use_cases/draftUseCases";

export const draftStart = inngest.createFunction(
  { id: "draft-start" },
  { event: "draft/draft.start" },
  async ({ event, step }) => {
    const { leagueName, draftStart } = event.data;
    await step.sleep("wait-for-draft-start", event.data.draftStart);
    return { message: `Draft started for ${event.data.leagueName}!` };
  },
);

export const draftComplete = inngest.createFunction(
  { id: "draft-complete" },
  { event: "draft/draft.complete" },
  async ({ event, step }) => {
    await step.sleep("wait-for-draft-complete", "100s");
    return { message: `Draft completed for ${event.data.email}!` };
  },
);  

export const handlePickTimer = inngest.createFunction(
  { id: "pick-timer", cancelOn: [{ event: "draft/pick.submitted", match: "data.pickId" }] },
  { event: "draft/turn.started" },
  async ({ event, step }) => {
    const { pickId, draftId } = event.data;

    const pick = await step.run("initialize-clock", async () => {
      const draft = await getDraftSettings({ leagueId: 1, draftId: 2 });
      const pickStart = new Date()
      const deadline = calculateDeadline(pickStart, 4, Number(draft.draftPauseStartTime), Number(draft.draftPauseEndTime));
      const updated = await startDraftPickClockUseCase(pickStart, deadline);
      return updated;
    });

    await step.sleepUntil("wait-for-pick-deadline", pick);

    await step.run("process-timeout", async () => {
      await markDraftPickOverduUseCase(pickId);
      const nextPick = await getNextDraftPickUseCase(2);
      
      if (nextPick) {
        await inngest.send({ name: "draft/turn.started", data: { pickId: nextPick[0]?.pickId, draftId } });
      }
      // Send Resend email here...
    });
  }
);