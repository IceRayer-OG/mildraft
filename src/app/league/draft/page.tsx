// React and Next.js imports
import { Suspense, use } from "react";
import { CheckCircle2, Clock } from "lucide-react";

// Global UI components
import { ScrollArea, ScrollBar } from "~/_components/ui/scroll-area";

// Feature components
import { WriteInDialog } from "~/app/_features/drafts/components/write-in-dialog";
import { QueueDrawer } from "~/app/_features/drafts/components/queue-drawer";
import { DraftDataTable } from "~/app/_features/drafts/components/draft-data-table";
import DraftQueueList from "~/app/_features/drafts/components/draft-picks-queue";
import { DraftOrderDialog } from "~/app/_features/drafts/components/DraftOrderDialog";
import DraftCountdownTimer from "~/app/_features/drafts/components/PickClockTimer";

// Server actions
import {
  getDraftablePlayersAction,
  getDraftPicksListAction,
  getActiveDraftAction,
} from "~/app/_features/drafts/actions/draftActions";
import { DraftHistoryDialog } from "~/app/_features/drafts/components/DraftHistory";
import { getLeagueTeamsAction } from "~/app/_features/team/actions/teamActions";
import { getDraftDetailsAction, getDraftPageDetailsAction } from "~/app/_features/leagues/actions/leagueActions";

export const dynamic = 'force-dynamic';

export default function DraftPage() {
  const activeDraft = use(getActiveDraftAction(1));
  const draftId = activeDraft?.id ?? 2;
  const leagueData = { leagueId: 1, draftId };

  const draftablePlayers = use(getDraftablePlayersAction());
  const draftPicks = use(getDraftPicksListAction(draftId));
  const allTeams = use(getLeagueTeamsAction());
  const userDraftDetails = use(getDraftDetailsAction(leagueData));
  const draftDetails = use(getDraftPageDetailsAction(leagueData));

  const isDraftCompleted = activeDraft?.status === "completed";
  const draftYear = activeDraft?.draftYear ?? 2026;

  return (
    <div className="flex flex-col w-full min-h-screen gap-4 p-3 sm:p-4 pb-28 bg-linear-to-b from-[#12026d] to-[#15162c] text-white">
      {/* Top Header / Timer Bar */}
      <div className="flex flex-wrap w-full min-h-10 py-1 justify-center gap-2 sm:gap-6 rounded-md items-center text-xs sm:text-sm text-center">
        {isDraftCompleted ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium">
            <CheckCircle2 className="size-4 text-emerald-400" />
            <span>{draftYear} Draft Complete</span>
          </div>
        ) : (
          <>
            <p className="font-medium text-stone-200">
              {draftYear} Draft Start:{" "}
              {userDraftDetails.draftStart ? userDraftDetails.draftStart.toDateString() : "TBD"} @{" "}
              {userDraftDetails.draftTime || "TBD"}
            </p>
            <Suspense>
              <DraftCountdownTimer targetDate={draftDetails.serverDetails}/>
            </Suspense>
          </>
        )}
      </div>

      {/* Picks Banner / Draft Order */}
      <div className="flex items-center bg-white/5 backdrop-blur-md rounded-lg border border-white/10 px-2 py-1">
        <div className="flex flex-col border-r border-white/15 justify-center text-xs md:text-sm pr-2 text-stone-400">
          <p className="p-1 rotate-270 uppercase tracking-widest font-semibold">Picks</p>
        </div>
        <div className="flex grow h-16 p-2 items-center overflow-hidden">
          <ScrollArea className="w-full whitespace-nowrap overflow-x-auto">
            <div>
              <Suspense fallback={<div className="text-xs text-stone-400">Loading picks...</div>}>
                {isDraftCompleted ? (
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium pl-3 h-full">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
                    <span>The {draftYear} Draft is complete! All picks have been made.</span>
                  </div>
                ) : draftPicks && draftPicks.length > 0 ? (
                  <DraftQueueList draftQueue={draftPicks} />
                ) : (
                  <div className="flex items-center gap-2 text-stone-300 text-sm pl-3 h-full">
                    <Clock className="size-4 shrink-0 text-amber-400" />
                    <span>The {draftYear} Draft has not started yet. Draft order has not been established.</span>
                  </div>
                )}
              </Suspense>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="p-0 place-content-center">
          <Suspense>
            <DraftOrderDialog
              draftOrderList={draftPicks}
              leagueTeams={allTeams}
              draftId={draftId}
              isCompleted={isDraftCompleted}
            />
          </Suspense>
        </div>
      </div>

      <div className="flex flex-col grow gap-4">
        <Suspense fallback={<div className="w-full h-full p-8 text-center text-stone-400">Loading draft board...</div>}>
          <DraftDataTable data={draftablePlayers} />
        </Suspense>
      </div>
      <div className="flex fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 max-w-[calc(100%-2rem)] sm:max-w-fit mx-auto inset-x-0 bg-slate-950/90 backdrop-blur-md border border-white/20 rounded-full justify-center items-center shadow-2xl py-1 px-3 sm:px-4 gap-1 sm:gap-2">
        <div>
          <Suspense fallback={<button className="px-4 py-2 text-sm text-stone-300">Queue</button>}>
            <QueueDrawer />
          </Suspense>
        </div>
        <div>
          <WriteInDialog />
        </div>
        <div>
          <Suspense fallback={<button className="px-4 py-2 text-sm text-stone-300">History</button>}>
            <DraftHistoryDialog draftId={draftId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
