import { calculateDeadline } from "~/lib/date-utils";
import { inngest } from "./client";
import { getDraftSettings } from "~/app/_features/leagues/database/queries";
import { 
  markDraftPickOverduUseCase, 
  startDraftPickClockUseCase,
  getNextDraftPickUseCase, 
  getCurrentDraftPickUseCase
} from "~/app/_features/drafts/use_cases/draftUseCases";

export const draftStart = inngest.createFunction(
  { id: "draft-start",
    cancelOn: [{
      event: "draft/draftStart.changed",
      match: "data.draftId"
    }]
   },
  { event: "draft/draft.start" },
  async ({ event, step }) => {
    await step.sleepUntil("wait-for-draft-start", new Date(event.data.draftStart).toISOString());

    const firstPick = await step.run("getting-first-pick", async () => {
      const [firstPickData] = await getCurrentDraftPickUseCase()
      if(!firstPickData) throw new Error("No first Pick")
      return firstPickData;
    });

    await step.run("start-the-clock", async () => {
      await inngest.send({name: 'draft/turn.started', data: { pickId: firstPick.draft_pick.id, draftId: 2 }})
    })
    
    return { message: `Draft started for ${event.data.leagueName}!` };
  },
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

    const pick = await step.run("initialize-clock", async () => {
      const draft = await getDraftSettings({ leagueId: 1, draftId: 2 });
      const pickStart = await new Date()
      const deadline = await calculateDeadline(pickStart, draft.pickDuration, Number(draft.draftPauseEndTime.toString().split(":")[0]), Number(draft.draftPauseStartTime.toString().split(":")[0]), "America/Los_Angeles");
      const updated = await startDraftPickClockUseCase(pickId, pickStart, deadline);
      return updated;
    });

    await step.sleepUntil("wait-for-pick-deadline", pick);

    await step.run("process-timeout", async () => {
      await markDraftPickOverduUseCase(pickId);
      const [nextPick] = await getNextDraftPickUseCase(2);
      
      if (nextPick != undefined) {
        await inngest.send({ name: "draft/turn.started", data: { pickId: nextPick?.pickId, draftId } });
      }
      // Send Resend email here...
    });
  }
);