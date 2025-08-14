
import { LucideSettings } from "lucide-react";

// React and Next.js imports
import { Suspense } from "react";

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


export const dynamic = "force-dynamic"; 

export default async function DraftPage() {
  const draftablePlayers = await getDraftablePlayersAction();
  const draftPicks = getDraftPicksListAction();
  const allTeams = getLeagueTeamsAction();

  return (
    <main className="flex flex-col w-full min-h-screen gap-4 p-4 bg-gradient-to-b from-[#12026d] to-[#15162c] text-white">
      <div className="flex border p-2 rounded-md">
        <div className="justify-start pr-2">
          <p className="grow content-center">Picks</p>
          <Separator />
          <div className="flex items-center p-2 gap-2">
            <p className="font-semibold">Clock: </p>
            <p>4:00:00</p>
          </div>
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
