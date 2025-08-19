// React and Next.js imports
import { Suspense, use } from "react";

// Global UI components
import { Separator } from "~/_components/ui/separator";
import { ScrollArea, ScrollBar } from "~/_components/ui/scroll-area";

// Feature components
import { WriteInDialog } from "~/features/drafts/components/write-in-dialog";
import { QueueDrawer } from "~/features/drafts/components/queue-drawer";
import { draftColumns } from "~/features/drafts/components/draft-columns";
import { DataTable } from "~/features/drafts/components/draft-data-table";
import DraftQueueList from "~/features/drafts/components/draft-picks-queue";
import { DraftOrderDialog } from "~/features/drafts/components/DraftOrderDialog";

// Server actions
import { getDraftablePlayersAction, getDraftPicksListAction } from "~/features/drafts/actions/draftActions";
import { DraftHistoryDialog } from "~/features/drafts/components/DraftHistory";
import { getLeagueTeamsAction } from "~/features/team/actions/teamActions";
import { getDraftSettingsAction } from "~/features/leagues/actions/leagueActions";


export default function DraftPage() {
  const leagueData = { leagueId: 1, draftId: 2}
  const draftablePlayers = use(getDraftablePlayersAction());
  const draftPicks = getDraftPicksListAction();
  const allTeams = getLeagueTeamsAction();
  const draftDetails = use(getDraftSettingsAction(leagueData))

  return (
    <main className="flex flex-col w-full min-h-screen gap-4 p-4 bg-linear-to-b from-[#12026d] to-[#15162c] text-white">
      <div className="flex w-full h-[40px] justify-center gap-8 rounded-md">
        <p>Draft Start Date: {draftDetails.draftStart}</p>
        <p>Draft Start Time: {draftDetails.draftTime}</p>

      </div>
      <div className="flex border p-1 rounded-md">
        <div className="justify-start pr-2 space-y-1">
          <p>Picks</p>
          <Separator />
          <p> <span className="font-semibold">Clock:</span> {draftDetails.pickDuration}:00 h</p>
        </div>
        <div className="flex grow justify-start items-center overflow-hidden">
          <ScrollArea className="w-full whitespace-nowrap overflow-x-auto">
            <div className="w-full ">
              <Suspense fallback={<div>Loading...</div>}>
                <DraftQueueList draftQueue={draftPicks} />
              </Suspense>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="place-content-center">
          <DraftOrderDialog draftOrderList={draftPicks} leagueTeams={allTeams}/>
        </div>
      </div>
      <div>
        <ScrollArea className="w-full whitespace-nowrap overflow-x-auto">
          <div className="w-full overflow-hidden">
            <Suspense fallback={<div className="w-full h-full">Loading...</div>}>
              <DataTable columns={draftColumns} data={draftablePlayers} />
            </Suspense>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="flex fixed bottom-0 gap-4 justify-center w-full">
        <div className=" pb-8">
          <QueueDrawer />
        </div>
        <div>
          <WriteInDialog />
        </div>
        <div>
          <DraftHistoryDialog />
        </div>
      </div>
    </main>
  )
}
