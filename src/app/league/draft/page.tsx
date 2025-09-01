// React and Next.js imports
import { Suspense, use } from "react";

// Global UI components
import { Separator } from "~/_components/ui/separator";
import { ScrollArea, ScrollBar } from "~/_components/ui/scroll-area";

// Feature components
import { WriteInDialog } from "~/app/_features/drafts/components/write-in-dialog";
import { QueueDrawer } from "~/app/_features/drafts/components/queue-drawer";
import { draftColumns } from "~/app/_features/drafts/components/draft-columns";
import { DataTable } from "~/app/_features/drafts/components/draft-data-table";
import DraftQueueList from "~/app/_features/drafts/components/draft-picks-queue";
import { DraftOrderDialog } from "~/app/_features/drafts/components/DraftOrderDialog";
import DraftCountdownTimer from "~/app/_features/drafts/components/PickClockTimer"

// Server actions
import { getDraftablePlayersAction, getDraftPicksListAction } from "~/app/_features/drafts/actions/draftActions";
import { DraftHistoryDialog } from "~/app/_features/drafts/components/DraftHistory";
import { getLeagueTeamsAction } from "~/app/_features/team/actions/teamActions";
import { getDraftSettingsAction } from "~/app/_features/leagues/actions/leagueActions";


export default function DraftPage() {
  const leagueData = { leagueId: 1, draftId: 2}
  const draftablePlayers = use(getDraftablePlayersAction());
  const draftPicks = getDraftPicksListAction();
  const allTeams = getLeagueTeamsAction();
  const draftDetails = use(getDraftSettingsAction(leagueData))

  return (
    <main className="flex flex-col w-full min-h-screen gap-4 p-4 bg-linear-to-b from-[#12026d] to-[#15162c] text-white">
      <div className="flex w-full h-[40px] justify-center gap-8 rounded-md items-center">
        <p>Draft Start Date: {draftDetails.draftStart}</p>
        <p>Draft Start Time: {draftDetails.draftTime}</p>
        <div className="flex">
          <Suspense>
            <DraftCountdownTimer targetDate={new Date(draftDetails.draftStart+" "+draftDetails.draftTime)} />
          </Suspense>
        </div>
      </div>
      <div className="flex border p-1 rounded-md">
        <div className="justify-start pr-2 space-y-1">
          <p>Picks</p>
          <Separator />
          <div className="flex grow">
            <p><span className="font-semibold">Clock:</span> {draftDetails.pickDuration}:00 h</p>
          </div>
        </div>
        <div className="flex grow justify-start items-center overflow-hidden">
          <ScrollArea className="w-full whitespace-nowrap overflow-x-auto">
            <div className="h-[75px]">
              <Suspense fallback={<div>Loading...</div>}>
                <DraftQueueList draftQueue={draftPicks} />
              </Suspense>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="place-content-center">
          <Suspense>
            <DraftOrderDialog draftOrderList={draftPicks} leagueTeams={allTeams}/>
          </Suspense>
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
      <div className="flex fixed bottom-0 gap-4 justify-center w-full pb-8">
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
    </main>
  )
}
