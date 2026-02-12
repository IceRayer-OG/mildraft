import { inngest } from "./client";

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

// // Handle a pick the runs over their timer
// export const draftTimeoutHandler = inngest.createFunction(
//   { id: "handle-draft-timeout", 
//     cancelOn: [{ 
//       event: "draft/pick.made", 
//       match: "data.pickId" 
//     }] 
//   },
//   { event: "draft/turn.started" },
//   async ({ event, step }) => {
//     const { pickId, userId, clockEndsAt, leagueEmail } = event.data;

//     // 1. Set the timers for the pick - wait until the clock ends, then add a grace period
//     await step.sleepUntil("wait-for-clock-end", clockEndsAt);
//     await step.sleep("grace-period", "30s");

//     // 2. Double check Drizzle to see if they picked in the last few seconds
//     const pick = await step.run("check-final-status", async () => {
//       return await db.query.draftPicks.findFirst({
//         where: (picks, { and, eq, isNull }) => and(
//           eq(picks.id, pickId),
//           isNull(picks.completedAt)
//         ),
//         with: { user: true } // Assuming you have a relation to get the user's name
//       });
//     });

//     // 3. If they missed it, update DB and Send Email
//     if (pick) {
//       await step.run("overdue-and-notify", async () => {
//         // Mark as skipped in Drizzle
//         await db.update(draftPicks)
//           .set({ status: "overdue" })
//           .where(eq(draftPicks.id, pickId));

//         // Send the Resend email
//         await sendLeagueNotification(
//           leagueEmail, 
//           pick.user.name, 
//           "The next manager" // You can fetch the actual next user here too
//         );
//       });

//       // 4. Trigger the NEXT turn event to start the NEW 4-hour clock
//       await step.run("trigger-next-clock", async () => {
//          await inngest.send({
//            name: "draft/turn.started",
//            data: { pickId: nextPickId, userId: nextUserId, leagueEmail }
//          });
//       });
//     }
//   }
// );