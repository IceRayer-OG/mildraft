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
  const draftablePlayers = getDraftablePlayersAction();
  const draftPicks = getDraftPicksListAction();
  const allTeams = getLeagueTeamsAction();
  const draftDetails = getDraftSettingsAction(leagueData);

  return (
    <div className="flex flex-col w-full min-h-screen gap-4 p-4 bg-linear-to-b from-[#12026d] to-[#15162c] text-white">
      <div className="flex w-full h-10 justify-center gap-8 rounded-md items-center text-sm md:text-md">
        <p>Draft Start: {use(draftDetails).draftStart} @ {use(draftDetails).draftTime}</p>
        <Suspense>
          <DraftCountdownTimer targetDate={new Date(use(draftDetails).draftStart+" "+use(draftDetails).draftTime)} />
        </Suspense>
      </div>
      <div className="flex border rounded-md">
        <div className="flex flex-col text-sm md:text-md">
          <p className="p-1">Picks</p>
          <Separator decorative={true} />
          <div className="p-1 whitespace-nowrap">
            <p>Clock: {use(draftDetails).pickDuration}:00 h</p>
          </div>
        </div>
        <div>
          <Separator orientation="vertical" decorative={true} />
        </div>
        <div className="flex grow h-16 p-2 items-center overflow-hidden">
          <ScrollArea className="w-full whitespace-nowrap overflow-x-auto">
            <div>
              <Suspense fallback={<div>Loading...</div>}>
                <DraftQueueList draftQueue={draftPicks} />
              </Suspense>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div>
          <Separator orientation="vertical" decorative={true} />
        </div>
        <div className=" p-0 place-content-center">
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
    </div>
  )
}
