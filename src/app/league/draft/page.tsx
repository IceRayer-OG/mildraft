// React and Next.js imports
import { Suspense, use } from "react";

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
  const draftPicks = use(getDraftPicksListAction());
  const allTeams = use(getLeagueTeamsAction());
  const userDraftDetails = use(getDraftDetailsAction(leagueData));
  const draftDetails = use(getDraftPageDetailsAction(leagueData));

  return (
    <div className="flex flex-col w-full min-h-screen gap-4 p-4 pb-24 bg-linear-to-b from-[#12026d] to-[#15162c] text-white">
      <div className="flex w-full h-10 justify-center gap-8 rounded-md items-center text-sm md:text-md">
        <p>
          {activeDraft?.draftYear ?? 2026} Draft Start:{" "}
          {userDraftDetails.draftStart ? userDraftDetails.draftStart.toDateString() : "TBD"} @{" "}
          {userDraftDetails.draftTime || "TBD"}
        </p>
        <Suspense>
          <DraftCountdownTimer targetDate={draftDetails.serverDetails}/>
        </Suspense>
      </div>
      <div className="flex">
        <div className="flex flex-col border-r justify-center text-sm md:text-md">
          <p className="p-1 rotate-270">Picks</p>
        </div>
        <div className="flex grow h-16 p-2 items-center overflow-hidden">
          <ScrollArea className="w-full whitespace-nowrap overflow-x-auto">
            <div>
              <Suspense fallback={<div>Loading...</div>}>
                {draftPicks && draftPicks.length > 0 ? (
                  <DraftQueueList draftQueue={draftPicks} />
                ) : (
                  <div className="text-gray-300 text-sm pl-4 flex items-center h-full">
                    {activeDraft?.draftYear ?? 2027} Draft Order has not been established yet.
                  </div>
                )}
              </Suspense>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="p-0 place-content-center">
          <Suspense>
            <DraftOrderDialog draftOrderList={draftPicks} leagueTeams={allTeams}/>
          </Suspense>
        </div>
      </div>
      <div className="flex flex-col grow gap-4">
        <Suspense fallback={<div className="w-full h-full p-8 text-center text-stone-400">Loading draft board...</div>}>
          <DraftDataTable data={draftablePlayers} />
        </Suspense>
      </div>
      <div className="flex fixed bottom-3 z-30 max-w-fit mx-auto inset-x-0 bg-slate-950/90 backdrop-blur-md border border-white/20 rounded-full justify-center shadow-2xl py-1 px-4 gap-2">
        <div>
          <QueueDrawer />
        </div>
        <div>
          <WriteInDialog />
        </div>
        <div>
          <DraftHistoryDialog />
        </div>
      </div>
    </div>
  );
}
